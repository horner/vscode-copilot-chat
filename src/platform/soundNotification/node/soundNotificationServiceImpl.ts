/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { exec } from 'child_process';
import { promisify } from 'util';
import { ConfigKey, IConfigurationService } from '../../configuration/common/configurationService';
import { ISoundNotificationService } from '../common/soundNotificationService';
import { isMacintosh } from '../../../util/vs/base/common/platform';

const execAsync = promisify(exec);

export class SoundNotificationService implements ISoundNotificationService {
	declare readonly _serviceBrand: undefined;

	constructor(
		private readonly configurationService: IConfigurationService
	) { }

	async notifyForApproval(message?: string): Promise<void> {
		const enabled = this.configurationService.getConfig(ConfigKey.SoundNotificationEnabled);
		if (!enabled) {
			return;
		}

		const notificationType = this.configurationService.getConfig(ConfigKey.SoundNotificationType);
		const defaultMessage = this.configurationService.getConfig(ConfigKey.SoundNotificationMessage);
		const finalMessage = message || defaultMessage;

		try {
			if (notificationType === 'say' && isMacintosh) {
				await this.playMacOSSayCommand(finalMessage);
			} else {
				await this.playBeep();
			}
		} catch (error) {
			// Fallback to beep if say command fails
			try {
				await this.playBeep();
			} catch (fallbackError) {
				// Silently fail if both methods fail
				console.debug('Sound notification failed:', error, fallbackError);
			}
		}
	}

	private async playMacOSSayCommand(message: string): Promise<void> {
		// Escape the message for shell command
		const escapedMessage = message.replace(/'/g, "\\'");
		await execAsync(`say '${escapedMessage}'`);
	}

	private async playBeep(): Promise<void> {
		if (isMacintosh) {
			// macOS beep
			await execAsync('afplay /System/Library/Sounds/Glass.aiff');
		} else if (process.platform === 'win32') {
			// Windows beep - using powershell to play system sound
			await execAsync('powershell -c "[console]::beep(800,200)"');
		} else {
			// Linux/Unix beep - try multiple methods
			try {
				await execAsync('paplay /usr/share/sounds/alsa/Front_Left.wav');
			} catch {
				try {
					await execAsync('aplay /usr/share/sounds/alsa/Front_Left.wav');
				} catch {
					// Final fallback - terminal bell
					process.stdout.write('\x07');
				}
			}
		}
	}
}
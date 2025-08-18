/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { commands } from 'vscode';
import { ConfigKey, IConfigurationService } from '../../configuration/common/configurationService';
import { ISoundNotificationService } from '../common/soundNotificationService';
import { isMacintosh } from '../../../util/vs/base/common/platform';

export class VSCodeSoundNotificationService implements ISoundNotificationService {
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
				// Try to use VS Code terminal to run say command
				await commands.executeCommand('workbench.action.terminal.sendSequence', {
					text: `say '${finalMessage.replace(/'/g, "\\'")}'\r`
				});
			} else {
				// Fallback to VS Code's built-in notification sound or beep
				await this.playBeep();
			}
		} catch (error) {
			// Fallback to simple beep
			await this.playBeep();
		}
	}

	private async playBeep(): Promise<void> {
		try {
			// Try to use VS Code's built-in bell/beep sound
			// This might not work in all VS Code versions, so we have fallbacks
			await commands.executeCommand('workbench.action.terminal.bell');
		} catch {
			// Ultimate fallback - this should work in most terminal environments
			try {
				await commands.executeCommand('workbench.action.terminal.sendSequence', {
					text: '\x07' // ASCII bell character
				});
			} catch {
				// Silent failure - no sound notification available
				console.debug('Sound notification not available in this environment');
			}
		}
	}
}
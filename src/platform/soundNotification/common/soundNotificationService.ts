/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createServiceIdentifier } from '../../../util/common/services';

export interface ISoundNotificationService {
	readonly _serviceBrand: undefined;

	/**
	 * Play a sound notification when approval is needed
	 * @param message Custom message to announce (used with 'say' on macOS)
	 */
	notifyForApproval(message?: string): Promise<void>;
}

export const ISoundNotificationService = createServiceIdentifier<ISoundNotificationService>('ISoundNotificationService');

export class NullSoundNotificationService implements ISoundNotificationService {
	declare readonly _serviceBrand: undefined;

	async notifyForApproval(message?: string): Promise<void> {
		// No-op implementation
	}
}
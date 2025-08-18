/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../util/vs/platform/instantiation/common/instantiation';
import { ISoundNotificationService } from '../../../platform/soundNotification/common/soundNotificationService';
import { SoundNotificationService } from '../../../platform/soundNotification/node/soundNotificationServiceImpl';
import { IConfigurationService } from '../../../platform/configuration/common/configurationService';

export class SoundNotificationContribution {
	constructor(@IInstantiationService instantiationService: IInstantiationService) {
		// Register the Node.js implementation
		const configurationService = instantiationService.get(IConfigurationService);
		const soundNotificationService = new SoundNotificationService(configurationService);
		instantiationService.set(ISoundNotificationService, soundNotificationService);
	}
}
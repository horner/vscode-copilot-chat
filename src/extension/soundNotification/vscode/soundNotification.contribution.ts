/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IInstantiationService } from '../../../util/vs/platform/instantiation/common/instantiation';
import { ISoundNotificationService } from '../../../platform/soundNotification/common/soundNotificationService';
import { VSCodeSoundNotificationService } from '../../../platform/soundNotification/vscode/soundNotificationServiceImpl';
import { IConfigurationService } from '../../../platform/configuration/common/configurationService';

export const soundNotificationContribution = (instantiationService: IInstantiationService) => {
	// Register the VS Code implementation for web environments
	const configurationService = instantiationService.get(IConfigurationService);
	const soundNotificationService = new VSCodeSoundNotificationService(configurationService);
	instantiationService.set(ISoundNotificationService, soundNotificationService);
};
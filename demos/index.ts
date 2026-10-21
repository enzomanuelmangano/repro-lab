import type { ComponentType } from 'react';

import * as bottomTabsSurfaceRebuild from './bottom-tabs-surface-rebuild';
import * as expoUiSecureTextInput from './expo-ui-secure-text-input';
import * as screensHeaderItemsMorph from './screens-header-items-morph';
import * as screensInteractivePopRelease from './screens-interactive-pop-release';
import * as webgpuSkiaSharedInstance from './webgpu-skia-shared-instance';

export type Demo = {
  name: string;
  description: string;
  component: ComponentType<any>;
  options?: object;
};

export const demos: Demo[] = [
  screensHeaderItemsMorph,
  expoUiSecureTextInput,
  webgpuSkiaSharedInstance,
  screensInteractivePopRelease,
  bottomTabsSurfaceRebuild,
];

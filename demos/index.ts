import type { ComponentType } from 'react';

import * as expoUiSecureTextInput from './expo-ui-secure-text-input';
import * as screensHeaderItemsMorph from './screens-header-items-morph';

export type Demo = {
  name: string;
  description: string;
  component: ComponentType<any>;
  options?: object;
};

export const demos: Demo[] = [screensHeaderItemsMorph, expoUiSecureTextInput];

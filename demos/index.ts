import type { ComponentType } from 'react';

import * as screensHeaderItemsMorph from './screens-header-items-morph';

export type Demo = {
  name: string;
  description: string;
  component: ComponentType<any>;
};

export const demos: Demo[] = [screensHeaderItemsMorph];

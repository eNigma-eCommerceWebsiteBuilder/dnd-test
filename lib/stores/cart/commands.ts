'use client';

import { createCartMutationCommands } from './mutation-commands';
import { createCartQueryCommands } from './query-commands';
import type { CartCommandContext, CartStoreMethods } from './types';

export function createCartCommands(context: CartCommandContext): CartStoreMethods {
  return {
    ...createCartQueryCommands(context),
    ...createCartMutationCommands(context),
  };
}

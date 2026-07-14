'use client';

import { create } from 'zustand';
import type { OverlayStoreState } from './types';

export const useOverlayStore = create<OverlayStoreState>((set, get) => ({
  activeOverlay: null,
  openOverlay: (overlay) => set({ activeOverlay: overlay }),
  closeOverlay: (overlay) => {
    if (!overlay || get().activeOverlay === overlay) {
      set({ activeOverlay: null });
    }
  },
  toggleOverlay: (overlay) =>
    set((state) => ({
      activeOverlay: state.activeOverlay === overlay ? null : overlay,
    })),
}));

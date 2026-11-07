import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ExpressiveMood } from '../types';

export interface HoppiGlobalOverlayState {
  isMainAppMinimized: boolean;
  mascotPosition: { x: number; y: number };
  isAlwaysOnTop: boolean;
  desktopMascotActive: boolean;
  minimizeMainApp: () => void;
  restoreMainApp: () => void;
  toggleMinimize: () => void;
  setMascotPosition: (pos: { x: number; y: number }) => void;
  setIsAlwaysOnTop: (val: boolean) => void;
}

const HoppiGlobalOverlayContext = createContext<HoppiGlobalOverlayState | undefined>(undefined);

const LOCAL_STORAGE_MINIMIZED_KEY = 'hoppi_app_minimized';
const LOCAL_STORAGE_POS_KEY = 'hoppi_desktop_mascot_pos';
const LOCAL_STORAGE_ALWAYS_ON_TOP_KEY = 'hoppi_mascot_always_on_top';

export const HoppiGlobalOverlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Persistent Minimized State
  const [isMainAppMinimized, setIsMainAppMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_STORAGE_MINIMIZED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // 2. Persistent Mascot Position State
  const [mascotPosition, setMascotPositionState] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_POS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved mascot position:', e);
    }
    const defaultX = typeof window !== 'undefined' ? Math.max(30, window.innerWidth - 240) : 1050;
    return { x: defaultX, y: 120 };
  });

  // 3. Persistent Always-On-Top Desktop Level Flag
  const [isAlwaysOnTop, setIsAlwaysOnTopState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ALWAYS_ON_TOP_KEY);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Save Minimized state changes & broadcast to Mesh
  const minimizeMainApp = useCallback(() => {
    setIsMainAppMinimized(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_MINIMIZED_KEY, 'true');
      const channel = new BroadcastChannel('hoppi_overlay_mesh');
      channel.postMessage({ type: 'HOPPI_WINDOW_STATE', isMinimized: true });
      channel.close();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const restoreMainApp = useCallback(() => {
    setIsMainAppMinimized(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_MINIMIZED_KEY, 'false');
      const channel = new BroadcastChannel('hoppi_overlay_mesh');
      channel.postMessage({ type: 'HOPPI_WINDOW_STATE', isMinimized: false });
      channel.close();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMainAppMinimized((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_MINIMIZED_KEY, String(next));
        const channel = new BroadcastChannel('hoppi_overlay_mesh');
        channel.postMessage({ type: 'HOPPI_WINDOW_STATE', isMinimized: next });
        channel.close();
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  }, []);

  const setMascotPosition = useCallback((pos: { x: number; y: number }) => {
    setMascotPositionState(pos);
    try {
      localStorage.setItem(LOCAL_STORAGE_POS_KEY, JSON.stringify(pos));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const setIsAlwaysOnTop = useCallback((val: boolean) => {
    setIsAlwaysOnTopState(val);
    try {
      localStorage.setItem(LOCAL_STORAGE_ALWAYS_ON_TOP_KEY, String(val));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Listen to Mesh BroadcastChannel across multiple browser tabs / windows
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('hoppi_overlay_mesh');
      channel.onmessage = (event) => {
        if (event.data?.type === 'HOPPI_WINDOW_STATE') {
          setIsMainAppMinimized(!!event.data.isMinimized);
        }
      };
    } catch (e) {
      console.warn(e);
    }

    return () => {
      if (channel) channel.close();
    };
  }, []);

  const value: HoppiGlobalOverlayState = {
    isMainAppMinimized,
    mascotPosition,
    isAlwaysOnTop,
    desktopMascotActive: true,
    minimizeMainApp,
    restoreMainApp,
    toggleMinimize,
    setMascotPosition,
    setIsAlwaysOnTop,
  };

  return (
    <HoppiGlobalOverlayContext.Provider value={value}>
      {children}
    </HoppiGlobalOverlayContext.Provider>
  );
};

export const useHoppiGlobalOverlay = (): HoppiGlobalOverlayState => {
  const context = useContext(HoppiGlobalOverlayContext);
  if (!context) {
    throw new Error('useHoppiGlobalOverlay must be used within a HoppiGlobalOverlayProvider');
  }
  return context;
};

import React, { createContext, useCallback, useContext, useState } from 'react';

/* ──────────────────────────── Types ──────────────────────────── */

export interface HarvestItem {
  id: string;
  cropName: string;
  yieldPercent: number;
  estimatedValue: string;
  progress: number;
  icon: string;
  /** true while awaiting backend confirmation */
  pending?: boolean;
}

interface HarvestContextValue {
  harvests: HarvestItem[];
  /** Optimistically add a harvest (appears immediately, marked pending) */
  addHarvestOptimistic: (item: Omit<HarvestItem, 'id' | 'pending'>) => void;
  /** Simulated loading state for the initial fetch */
  isLoading: boolean;
  /** Mark loading as complete (called after simulated fetch) */
  setLoaded: () => void;
}

/* ──────────────────────────── Default Data ──────────────────────────── */

const DEFAULT_HARVESTS: HarvestItem[] = [
  {
    id: '1',
    cropName: 'Highland Kale',
    yieldPercent: 78,
    estimatedValue: '$4,320',
    progress: 0.78,
    icon: 'leaf-outline',
  },
  {
    id: '2',
    cropName: 'Russet Potatoes',
    yieldPercent: 62,
    estimatedValue: '$8,750',
    progress: 0.62,
    icon: 'nutrition-outline',
  },
  {
    id: '3',
    cropName: 'Organic Maize',
    yieldPercent: 91,
    estimatedValue: '$12,100',
    progress: 0.91,
    icon: 'flower-outline',
  },
];

/* ──────────────────────────── Context ──────────────────────────── */

const HarvestContext = createContext<HarvestContextValue | undefined>(undefined);

let nextId = 100;

export function HarvestProvider({ children }: { children: React.ReactNode }) {
  const [harvests, setHarvests] = useState<HarvestItem[]>(DEFAULT_HARVESTS);
  const [isLoading, setIsLoading] = useState(true);

  const setLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const addHarvestOptimistic = useCallback(
    (item: Omit<HarvestItem, 'id' | 'pending'>) => {
      const optimisticId = `optimistic-${nextId++}`;
      const newItem: HarvestItem = { ...item, id: optimisticId, pending: true };

      // Immediately add to state (optimistic update)
      setHarvests((prev) => [newItem, ...prev]);

      // Simulate backend call
      setTimeout(() => {
        setHarvests((prev) =>
          prev.map((h) =>
            h.id === optimisticId
              ? { ...h, id: String(nextId++), pending: false }
              : h
          )
        );
      }, 2000);
    },
    []
  );

  return (
    <HarvestContext.Provider value={{ harvests, addHarvestOptimistic, isLoading, setLoaded }}>
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvests() {
  const ctx = useContext(HarvestContext);
  if (!ctx) throw new Error('useHarvests must be used inside HarvestProvider');
  return ctx;
}

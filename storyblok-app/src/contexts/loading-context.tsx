'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isInitialLoading: boolean;
  setInitialLoadingComplete: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const setInitialLoadingComplete = () => {
    setIsInitialLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isInitialLoading, setInitialLoadingComplete }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}


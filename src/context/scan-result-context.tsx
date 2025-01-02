'use client';
import { Analysis, Disease, diseaseIdentified, ScanResult, Tree, Image   } from '@/type/types';
import React, { createContext, useState, useContext, ReactNode } from 'react';

type boundingBox = {diseaseName:string, x:number, y:number, w:number, h:number}

type ScanResultType = ({tree:Tree, originalImage:string, analyzedImage:string, boundingBoxes:boundingBox[], diseases: (diseaseIdentified & Disease)[]})

interface ScanResultContextType {
  scanResult:  ScanResultType | null;                            
  setScanResult: React.Dispatch<React.SetStateAction<ScanResultType | null>>;  
}

const ScanResultContext = createContext<ScanResultContextType | undefined>(undefined);

export const useScanResult = () => {
  const context = useContext(ScanResultContext);
  if (context === undefined) {
    throw new Error('useScanResult must be used within a ScanResultProvider');
  }
  return context;
};

export const ScanResultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scanResult, setScanResult] = useState<ScanResultType | null>(null);

  return (
    <ScanResultContext.Provider value={{ scanResult, setScanResult }}>
      {children}
    </ScanResultContext.Provider>
  );
};

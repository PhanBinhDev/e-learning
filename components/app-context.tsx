"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  currentGrade: string;
  currentSubject: string;
  setCurrentGrade: (grade: string) => void;
  setCurrentSubject: (subject: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [currentGrade, setCurrentGrade] = useState("Mẫu giáo");
  const [currentSubject, setCurrentSubject] = useState("Tiếng Anh");

  const value = {
    currentGrade,
    currentSubject,
    setCurrentGrade,
    setCurrentSubject,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

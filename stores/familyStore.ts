import { create } from "zustand";
import { Family } from "@/types";

interface FamilyState {
  currentFamily: Family | null;
  loading: boolean;
  setCurrentFamily: (family: Family | null) => void;
  setLoading: (loading: boolean) => void;
}

interface FamilyState {
  currentFamily: Family | null;
  loading: boolean;
  setCurrentFamily: (family: Family | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
  currentFamily: null,
  loading: false,
  setCurrentFamily: (family) => set({ currentFamily: family }),
  setLoading: (loading) => set({ loading }),
}));


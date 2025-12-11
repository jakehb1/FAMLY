import { create } from "zustand";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  zip: string | null;
  accuracy: number | null;
  setLocation: (
    lat: number,
    lng: number,
    city?: string,
    zip?: string,
    accuracy?: number
  ) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  city: null,
  zip: null,
  accuracy: null,
  setLocation: (lat, lng, city, zip, accuracy) =>
    set({ latitude: lat, longitude: lng, city, zip, accuracy }),
  clearLocation: () =>
    set({
      latitude: null,
      longitude: null,
      city: null,
      zip: null,
      accuracy: null,
    }),
}));


import { create } from "zustand";
import { mockTrips, getTripById } from "../data/trips";
import { getCurrentUser } from "../data/users";

const useStore = create((set) => ({
  // User state
  currentUser: getCurrentUser(),

  // Trip state
  trips: mockTrips,
  selectedTrip: null,

  // UI state
  isLoading: false,

  // Theme state
  theme: localStorage.getItem("theme") || "light",

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),

  setTrips: (trips) => set({ trips }),

  // Theme actions
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return { theme: newTheme };
    }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),

  updateTrip: (tripId, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, ...updates } : trip
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? { ...state.selectedTrip, ...updates }
          : state.selectedTrip,
    })),

  deleteTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== tripId),
      selectedTrip:
        state.selectedTrip?.id === tripId ? null : state.selectedTrip,
    })),

  setSelectedTrip: (tripId) => {
    const trip = tripId ? getTripById(tripId) : null;
    set({ selectedTrip: trip });
  },

  addCityToTrip: (tripId, city) =>
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id === tripId) {
          return {
            ...trip,
            cities: [...(trip.cities || []), city],
          };
        }
        return trip;
      }),
    })),

  addActivityToCity: (tripId, cityId, activityId) =>
    set((state) => ({
      trips: state.trips.map((trip) => {
        if (trip.id === tripId) {
          return {
            ...trip,
            cities: trip.cities.map((city) => {
              if (city.cityId === cityId) {
                return {
                  ...city,
                  activities: [...(city.activities || []), activityId],
                };
              }
              return city;
            }),
          };
        }
        return trip;
      }),
    })),

  logout: () => {
    localStorage.removeItem("currentUserId");
    set({ currentUser: null, selectedTrip: null });
    // Keep trips in store but clear selected trip
  },
}));

export default useStore;

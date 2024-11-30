import { Restaurant } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  name: string;
  email: string;
  phone_number: string;
  address?: string;
} | null;

interface UserStore {
  user: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}
interface RestaurantStore {
  restaurant: Restaurant | null;
  logout: () => void;
  setRestaurant: (restaurant: Restaurant) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user: user }),
      logout: () => set({ user: null }),
    }),
    { name: "user-store" }
  )
);

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set) => ({
      restaurant: null,
      setRestaurant: (restaurant) => set({ restaurant: restaurant }),
      logout: () => set({ restaurant: null }),
    }),
    { name: "restaurant-store" }
  )
);

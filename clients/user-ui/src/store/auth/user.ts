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

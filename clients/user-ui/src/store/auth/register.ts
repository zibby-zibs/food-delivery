import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RegisterStore {
  activation_token: string;
  setActivationToken: (a: string) => void;
}

export const useRegisterstore = create<RegisterStore>()(
  persist(
    (set) => ({
      activation_token: "",
      setActivationToken: (a: string) => set(() => ({ activation_token: a })),
    }),
    { name: "register-store" }
  )
);

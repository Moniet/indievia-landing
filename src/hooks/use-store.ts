import { create } from "zustand";

type Actions = {
  setUserProfileUrl: (userProfileUrl: string) => void;
  setFullName: (fullName: string) => void;
};

type Store = {
  fullName: string;
  userProfileUrl: string;
};

export const useStore = create<Store & Actions>((set) => ({
  userProfileUrl: "",
  fullName: "",
  setUserProfileUrl: (userProfileUrl: string) => set({ userProfileUrl }),
  setFullName: (fullName: string) => set({ fullName }),
}));

// import { DocumentData } from 'firebase/firestore'
import { atom } from "recoil";
import { Movies } from "../typeing";

export const modalState = atom({
  key: "modalState",
  default: false,
});
//modal
export const modalMylist = atom({
  key: "modalMylist",
  default: false,
});
//admin
export const modalSidebarAdmin = atom({
  key: "modalSidebarAdmin",
  default: false,
});
export const modalCreateUser = atom({
  key: "modalCreateUser",
  default: false,
});
//pay
export const payAccount = atom({
  key: "payAccount",
  default: 0,
});
//modalAccount
export const modalAccount = atom({
  key: "modalAccount",
  default: false,
});
export const modalEditUser = atom({
  key: "modalEditUser",
  default: false,
});

export const pageinationAtom = atom({
  key: "pageinationAtom",
  default: 1,
});

export const movieState = atom<Movies | null | null>({
  key: "movieState",
  default: null,
});

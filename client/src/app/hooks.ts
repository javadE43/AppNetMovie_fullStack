import {TypedUseSelectorHook,useDispatch,useSelector} from "react-redux";
import type {RootStore,AppDispatch} from "./store";


export const useAppSelector:TypedUseSelectorHook<RootStore>=useSelector
export const useAppDispatch=()=>useDispatch<AppDispatch>()
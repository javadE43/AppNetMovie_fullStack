import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth"
import categorysReducer from "../features/categorys/category"
import moviesReducer from "../features/movies/movies"
import mylistReducer from "../features/mylist/mylist"
import usersReducer from "../features/users/users"
import reviewReducer from "../features/ratings/review"
import sidebarReducer from "../features/sidebar/sidebar"


export const store = configureStore({
    reducer: {
       auth:authReducer,
       categorys:categorysReducer,
       movies:moviesReducer,
       mylist:mylistReducer,
       users:usersReducer,
       sidebar:sidebarReducer,
       review:reviewReducer
    }
})


export type RootStore=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch


export default store;
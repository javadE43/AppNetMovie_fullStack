import { createSlice } from "@reduxjs/toolkit";

// InitialState

interface initialState {
  toggle: boolean;
}

const initialState:initialState = {
  toggle: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {

    closesidebar:(state)=>{
        state.toggle=false
    },
    opensidebar:(state)=>{
        state.toggle=true
    },

  },
});

export const {closesidebar,opensidebar} =sidebarSlice.actions;
export default sidebarSlice.reducer
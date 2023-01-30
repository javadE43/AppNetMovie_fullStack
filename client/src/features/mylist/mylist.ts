import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Movies } from "../../typeing";
import { axiospublic, BASE_URL } from "../../axios/configApi";
import { AxiosInstance } from "axios";

//fatchmylist
interface Option {
    page?: number;
    pageSize?: number;
    category?: number;
    all?: boolean;
    search?: string;
    axiosPrivate: AxiosInstance,
    userid: number,
  }
export const fatchmylist = createAsyncThunk(
  "mylist/fatchmylist",
  async (option: Option) => {
    let url = `${BASE_URL}/mylist/${option.userid}`;
  let baseUrl = ``;
  if (option?.page && option.pageSize && option?.all && option?.category) {
    baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}&all=${option.all}`;
  } else if (option?.page && option.pageSize && option?.category) {
    baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}`;
  } else if (option?.page && option.pageSize && option?.category) {
    baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}`;
  } else if (option?.search) {
    baseUrl = `${url}?search=${option?.search}`;
  } else if (option?.page && option.pageSize) {
    baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}`;
  } else if (option?.page) {
    baseUrl = `${url}?page=${option?.page}&pageSize=${1000}`;
  } else if (option?.category) {
    baseUrl = `${url}?category=${option?.category}`;
  } else if (option?.all) {
    baseUrl = `${url}?all=true`;
  } else if (
    Object.keys(option).length < 3 ||
    option == null ||
    option == undefined
  ) {
    baseUrl = `${url}`;
  }
  // console.log(baseUrl);
  const response = await option.axiosPrivate.get(`${baseUrl}`);
  return response.data.data;
  }
);

//fatchDeleteMylist

interface Delete {
    axiosPrivate: AxiosInstance,
    userid: number,
    movieid: number,
    page?: number;
    pageSize?: number;
}
export const fatchDeleteMylist = createAsyncThunk(
  "mylist/fatchDeleteMylist",
  async (data: Delete) => {
    let url = `${BASE_URL}/mylist`;
    let baseUrl = ``;
    if (data.page && data.pageSize) {
      baseUrl = `${url}/${data.userid}/?page=${data.page}&pageSize=${data.pageSize}`;
    } else if (
      Object.keys(data).length < 3 ||
      data == null ||
      data == undefined
    ) {
      baseUrl = `${url}`;
    }
    // console.log(baseUrl);
    const response = await data.axiosPrivate.delete(
        `${BASE_URL}/mylist?userid=${data.userid}&movieid=${data.movieid}`
      );
      const res = await data.axiosPrivate.get(`${baseUrl}`);
    return response.data.data;
  }
);


//fatchmylistInsert
interface Insert {
  axiosPrivate: AxiosInstance;
  movie: Movies;
}
export const fatchmylistInsert = createAsyncThunk(
  "mylist/fatchmylistInsert",
  async (data: Insert) => {
    const response = await data.axiosPrivate.post(`${BASE_URL}/mylist`, data.movie);
    return response.data.data;
  }
);

//initialstate
interface InitialState {
    mylist: Movies[] 
    count: number
    delete: number
    insert: number
    isLoading: boolean
    ErrorMessage:string
  }
  
  const initialState:InitialState = {
    mylist:[],
    count: 0,
    delete: 0,
    insert: 0,
    isLoading: false,
    ErrorMessage:""
  };
//slice
const mylistSlice = createSlice({
  name: "mylist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fatchmylist
      .addCase(fatchmylist.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchmylist.fulfilled,
        (
          state,
          action: PayloadAction<{movies: Movies[]; count: number }>
        ) => {
          state.isLoading = false;
          state.mylist = action.payload.movies;
          state.count = action.payload.count;
          state.delete=0
          state.insert=0
        }
      )
      .addCase(fatchmylist.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
      })

      //fatchDeleteMylist
      .addCase(fatchDeleteMylist.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fatchDeleteMylist.fulfilled, (state, 
        action: PayloadAction<{movies: Movies[]; count: number }>
        ) => {
        state.isLoading = false;
        state.ErrorMessage = "";
        state.delete = 200;
        state.mylist = action.payload.movies;
        state.count = action.payload.count;
      })
      .addCase(fatchDeleteMylist.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.delete = 0;
      })

      //fatchInsertMovies
      .addCase(fatchmylistInsert.pending, (state, action) => {
        state.isLoading = true;
        state.insert = 0;
      })
      .addCase(fatchmylistInsert.fulfilled, (state, 
        action: PayloadAction<Movies>
        ) => {
        state.isLoading = false;
        state.ErrorMessage = "";
        state.insert = 201;
      })
      .addCase(fatchmylistInsert.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.insert = 0;
      })

  },
});

export default mylistSlice.reducer;

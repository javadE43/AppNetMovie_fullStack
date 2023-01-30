import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosInstance } from "axios";


//
import { Categories, Movies } from "../../typeing";
import { axiospublic, BASE_URL } from "../../axios/configApi";

//fatchmovies

//fatchcategoryPublic
export const fatchmoviesPublic = createAsyncThunk(
  "movies/fatchmoviesPublic",
  async () => {
    const response = await axiospublic.get(`${BASE_URL}/movies/allmovie`);
    return response.data.data;
  }
);

//fatchmovies
interface Option {
  axiosPrivate: AxiosInstance;
  page?: number;
  pageSize?: number;
  category?: number;
  username?: string;
  all?: boolean;
  search?: string;
}
export const fatchmovies = createAsyncThunk(
  "movies/fatchmovies",
  async (option: Option) => {
    let url = `${BASE_URL}/movies`;
    let baseUrl = ``;
    if (
      option?.page &&
      option.pageSize &&
      option?.all &&
      option?.category &&
      option?.username
    ) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}&username=${option?.username}&all=${option.all}`;
    } else if (
      option?.page &&
      option.pageSize &&
      option?.category &&
      option?.username
    ) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}&username=${option?.username}`;
    } else if (option?.page && option.pageSize && option?.category) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&category=${option?.category}`;
    } else if (option?.search) {
      baseUrl = `${url}?search=${option?.search}`;
    } else if (option?.page && option.pageSize && option?.username) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&username=${option?.username}`;
    } else if (option?.category && option?.username) {
      baseUrl = `${url}?category=${option?.category}&username=${option?.username}`;
    } else if (option?.page && option.pageSize) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}`;
    } else if (option?.page) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${1000}`;
    } else if (option?.username) {
      baseUrl = `${url}?username=${option?.username}`;
    } else if (option?.category) {
      baseUrl = `${url}?category=${option?.category}`;
    } else if (option?.all) {
      baseUrl = `${url}?all=true`;
    } else if (
      Object.keys(option).length < 1 ||
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

//fatchDeleteMovies
interface Delete {
  axiosPrivate: AxiosInstance;
  title: string;
  movieid: number;
  page: number;
  pageSize: number;
}
export const fatchDeleteMovies = createAsyncThunk(
  "moviess/fatchDeleteMovies",
  async (data: Delete) => {
    const response = await data.axiosPrivate.delete(
      `${BASE_URL}/movies?title=${data.title}&movieid=${data.movieid}`
    );
    const res = await data.axiosPrivate.get(
        `${BASE_URL}/movies?page=${data.page}&pageSize=${data.pageSize}`
      );
    return response.data.data;
  }
);

//fatchUpdateMovies
interface Update {
    axiosPrivate: AxiosInstance,
    data: FormData,
    movieid: number,
    userid: number,
}
export const fatchUpdateMovies = createAsyncThunk(
  "moviess/fatchUpdateMovies",
  async (data: Update) => {
    const response = await data.axiosPrivate.put(
        `${BASE_URL}/movies?movieid=${data.movieid}&userid=${data.userid}`,
        data.data
      );
    return response.data.data;
  }
);

//fatchInsertMovies
interface Insert {
  axiosPrivate: AxiosInstance;
  data: FormData;
  userid: number;
}
export const fatchInsertMovies = createAsyncThunk(
  "moviess/fatchInsertMovies",
  async (data: Insert) => {
    const response = await data.axiosPrivate.post(
      `${BASE_URL}/movies?userid=${data.userid}`,
      data.data
    );
    return response.data.data;
  }
);

//initialstate

interface InitialState {
    movies: Movies[] ;
    Allmovie: Movies[] ;
    insert: number;
    update: number;
    delete: number;
    count:number 
    isLoading: boolean;
    ErrorMessage:string 
  }
  
  const initialState:InitialState = {
    movies:sessionStorage.getItem("moviesTable") && JSON.parse(`${sessionStorage.getItem("moviesTable")}`)?JSON.parse(`${sessionStorage.getItem("moviesTable")}`) :[],
    Allmovie:sessionStorage.getItem("movies") && JSON.parse(`${sessionStorage.getItem("movies")}`)?JSON.parse(`${sessionStorage.getItem("movies")}`) :[],
    count:sessionStorage.getItem("countMovie") && JSON.parse(`${sessionStorage.getItem("countMovie")}`)?JSON.parse(`${sessionStorage.getItem("countMovie")}`) :0,
    insert: 0,
    update: 0,
    delete: 0,
    isLoading: false,
    ErrorMessage:""
  };
//slice
const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    restartDefaultMovies:(state)=>{
      state.count=0;
      state.insert= 0;
      state. update= 0;
      state. delete= 0;
      state.isLoading= false;
      state.ErrorMessage="";
    }
  },
  extraReducers: (builder) => {
    builder

      // fatchmoviesPublic
      .addCase(fatchmoviesPublic.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchmoviesPublic.fulfilled,
        (state, action: PayloadAction< Movies[]>) => {
          state.isLoading = false;
          state.Allmovie=action.payload
          if(action.payload){
            sessionStorage.setItem("movies",JSON.stringify(action.payload))
          }
        }
      )
      .addCase(fatchmoviesPublic.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
      })

      // fatchmovies
      .addCase(fatchmovies.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchmovies.fulfilled,
        (
          state,
          action: PayloadAction<{ movies: Movies[]; count: number }>
        ) => {
          state.isLoading = false;
          state.movies = action.payload?.movies;
          state.count = action.payload?.count;
          if(action.payload?.movies){
            sessionStorage.setItem("moviesTable",JSON.stringify(action.payload.movies))
            sessionStorage.setItem("countMovie",JSON.stringify(action.payload.count))
  
          }
        }
      )
      .addCase(fatchmovies.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
      })

      //fatchDeleteMovies
      .addCase(fatchDeleteMovies.pending, (state, action) => {
        state.isLoading = true;
        state.delete = 0;
        toast( " درخواست ثبت شد منتظر بمانید", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })
      .addCase(fatchDeleteMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = "";
        state.delete = 200;
        toast( " حذف با موفقیت انجام شد ", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })
      .addCase(fatchDeleteMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.delete = 0;
        toast( action.error.message, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })

      //fatchInsertMovies
      .addCase(fatchInsertMovies.pending, (state, action) => {
        state.isLoading = true;
        state.insert = 0;
        toast( " درخواست ثبت شد منتظر بمانید", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })
      .addCase(fatchInsertMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = "";
        state.insert = 201;
        toast( " فیلم جدید  با موفقیت ایجاد شد ", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })
      .addCase(fatchInsertMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.insert = 0;
        toast(action.error.message , {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })

      //fatchUpdateMovies
      .addCase(fatchUpdateMovies.pending, (state, action) => {
        state.isLoading = true;
        state.update = 0;
        toast( " درخواست ثبت شد منتظر بمانید", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      })
      .addCase(fatchUpdateMovies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = "";
        state.update = 200;  
        toast( "ویرایش با موفقیت انجام شد", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });        
      })
      .addCase(fatchUpdateMovies.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.update = 0;
        toast(action.error.message, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });  
      });
  },
});

export const {restartDefaultMovies}=movieSlice.actions;
export default movieSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//
import { Categories } from "../../typeing";
import { axiospublic, BASE_URL } from "../../axios/configApi";
import { AxiosInstance } from "axios";

//fatchcategorys

//fatchcategoryPublic
export const fatchCategorysPublic = createAsyncThunk(
  "categorys/fatchCategorysPublic",
  async () => {
    const res = await axiospublic.get(`/category`);
    return res.data.data.categorys;
  }
);

//fatchcategory
interface Option {
  axiosPrivate: AxiosInstance;
  page?: number;
  pageSize?: number;
  bits?: number;
  userid?: number;
  search?: string;
}
export const fatchCategorys = createAsyncThunk(
  "categorys/fatchCategorys",
  async (option: Option) => {
    const url = `${BASE_URL}/category`;
    let baseUrl = "";

    if (option?.userid && option?.bits) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&userid=${option?.userid}&bits=${option?.bits}`;
    } else if (option?.userid) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&userid=${option?.userid}`;
    } else if (option?.bits) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&bits=${option?.bits}`;
    } else if (option?.search && option?.page && option?.pageSize) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&search=${option?.search}`;
    } else if (option?.search) {
      baseUrl = `${url}?search=${option?.search}`;
    } else if (
      option?.page &&
      option?.pageSize &&
      !option?.bits &&
      !option?.userid
    ) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}`;
    } else if (
      Object.keys(option).length < 1 ||
      option == null ||
      option == undefined
    ) {
      baseUrl = `${url}`;
    }
    // console.log(baseUrl)
    const res = await option.axiosPrivate.get(`${baseUrl}`);
    return {categorys:res.data.data.categorys,count:res.data.data.count.count};
  }
);

//fatchDeleteCategory
interface Delete {
  axiosPrivate: AxiosInstance;
  userid: number;
  bits: number;
}
export const fatchDeleteCategory = createAsyncThunk(
  "categorys/fatchDeleteCategory",
  async (data: Delete) => {
    const response = await data.axiosPrivate.delete(
      `${BASE_URL}/category?userid=${data.userid}&bits=${data.bits}`
    );
    return response.data.data;
  }
);

//fatchUpdateCategory
interface Update {
  axiosPrivate: AxiosInstance;
  data: FormData;
  userid: number;
  bits: number;
}
export const fatchUpdateCategory = createAsyncThunk(
  "categorys/fatchUpdateCategory",
  async (data: Update) => {
    const response = await data.axiosPrivate.put(
      `${BASE_URL}/category?userid=${data.userid}&bits=${data.bits}`,
      data.data
    );
    return response.data.data;
  }
);

//fatchInsertCategory
interface Insert {
  axiosPrivate: AxiosInstance;
  data: FormData;
  userid: number;
}
export const fatchInsertCategory = createAsyncThunk(
  "categorys/fatchInsertCategory",
  async (data: Insert) => {
    const response = await data.axiosPrivate.post(
      `${BASE_URL}/category?userid=${data.userid}`,
      data.data
    );
    return response.data.data;
  }
);

//initialstate

type Initialstate = {
  categorys: Categories[] ;
  categoryPublic: Categories[] ;
  update: number;
  delete: number;
  insert: number;
  count: number;
  isLoading: boolean;
  ErrorMassege: string;
};

const initialState: Initialstate = {
  categorys:sessionStorage.getItem("categorysTable") && JSON.parse(`${sessionStorage.getItem("categorysTable")}`)?JSON.parse(`${sessionStorage.getItem("categorysTable")}`) :[],
  categoryPublic:sessionStorage.getItem("categorys") && JSON.parse(`${sessionStorage.getItem("categorys")}`)?JSON.parse(`${sessionStorage.getItem("categorys")}`) :[],
  update: 0,
  delete: 0,
  insert: 0,
  count:sessionStorage.getItem("countTable") && JSON.parse(`${sessionStorage.getItem("countTable")}`)?JSON.parse(`${sessionStorage.getItem("countTable")}`) :0,
  isLoading: false,
  ErrorMassege: "",
};

//slice
const categorySlice = createSlice({
  name: "categorys",
  initialState,
  reducers: {

    restartDefaultCategorys:(state)=>{
      state.update= 0;
      state.delete= 0;
      state.insert= 0;
      state.count= 0;
      state.isLoading= false;
      state.ErrorMassege= "";
    }
  },
  extraReducers: (builder) => {
    builder

      // fatchCategorysPublic
      .addCase(fatchCategorysPublic.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchCategorysPublic.fulfilled,
        (state, action: PayloadAction<Categories[]>) => {
          state.isLoading = false;
          state.categoryPublic = action.payload;
          if(action.payload)
          sessionStorage.setItem("categorys",JSON.stringify( action.payload))
        }
      )
      .addCase(fatchCategorysPublic.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = action.error.message || "";
      })

      // fatchCategorys
      .addCase(fatchCategorys.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchCategorys.fulfilled,
        (
          state,
          action: PayloadAction<{ categorys: Categories[]; count: number }>
        ) => {
          state.isLoading = false;
          state.categorys = action.payload.categorys;
          state.count = action.payload.count;
          if(action.payload?.categorys){
            sessionStorage.setItem("categorysTable",JSON.stringify( action.payload.categorys))
            sessionStorage.setItem("countTable",JSON.stringify(  action.payload.count))
          }
        }
      )
      .addCase(fatchCategorys.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = action.error.message || "";
      })

      //deletecategory
      .addCase(fatchDeleteCategory.pending, (state, action) => {
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
      .addCase(fatchDeleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = "";
        state.delete = 200;
        toast( " حذف با موفقیت انجام شد", {
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
      .addCase(fatchDeleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = action.error.message || "";
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

      //insertcategory
      .addCase(fatchInsertCategory.pending, (state, action) => {
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
      .addCase(fatchInsertCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = "";
        state.insert = 201;
        toast( " دسته بندی جدید ایجاد شد ", {
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
      .addCase(fatchInsertCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = action.error.message || "";
        state.insert = 0;
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

      //editcategory
      .addCase(fatchUpdateCategory.pending, (state, action) => {
        state.isLoading = true;
        state.update = 0;
        toast( "درخواست ویرایش ثبت شد", {
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
      .addCase(fatchUpdateCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = "";
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
      .addCase(fatchUpdateCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMassege = action.error.message || "";
        state.update = 0;
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
      });
  },
});

export const {restartDefaultCategorys}=categorySlice.actions;

export default categorySlice.reducer;

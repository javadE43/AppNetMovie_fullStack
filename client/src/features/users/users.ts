import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Users } from "../../typeing";
import { BASE_URL } from "../../axios/configApi";
import { AxiosInstance } from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//fatchUsers
interface UsersAll {
  axiosPrivate: AxiosInstance;
}

export const fatchAllUsers = createAsyncThunk(
  "users/fatchAllUsers",
  async (data: UsersAll) => {
    const response = await data.axiosPrivate.get(`${BASE_URL}/users/`);
    return {
      users: response.data.data[0],
      count: response.data.data[1].count.count,
    };
  }
);

//
interface Option {
  page?: number;
  pageSize?: number;
  userid?: number;
  search?: string;
  role?: string;
  axiosPrivate: AxiosInstance;
}
export const fatchUsers = createAsyncThunk(
  "users/fatchUsers",
  async (option: Option) => {
    const url = `${BASE_URL}/users`;
    let baseUrl = "";
    if (option?.role && option?.page) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&role=${option?.role}`;
    } else if (option?.role && !option?.page) {
      baseUrl = `${url}?role=${option?.role}`;
    } else if (option?.search && option?.page && option?.pageSize) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}&search=${option?.search}`;
    } else if (option?.search && !option?.page) {
      baseUrl = `${url}?search=${option?.search}`;
    } else if (option?.pageSize && option?.page) {
      baseUrl = `${url}?page=${option?.page}&pageSize=${option?.pageSize}`;
    } else if (
      Object.keys(option).length < 2 ||
      option == null ||
      option == undefined
    ) {
      baseUrl = `${url}`;
    }
    // console.log(baseUrl);
    const response = await option.axiosPrivate.get(`${baseUrl}`);
    return {
      users: response.data.data[0],
      count: response.data.data[1].count.count,
    };
  }
);

//fatchDeleteUsers
interface Delete {
  axiosPrivate: AxiosInstance;
  id: number;
  page: number;
  pageSize: number;
}
export const fatchDeleteUsers = createAsyncThunk(
  "users/fatchDeleteUsers",
  async (data: Delete) => {
    await data.axiosPrivate.delete(`${BASE_URL}/users/${data.id}`);
    const response = await data.axiosPrivate.get(
      `${BASE_URL}/users?page=${data.page}&pageSize=${data.pageSize}`
    );
    return {
      users: response.data.data[0],
      count: response.data.data[1].count.count,
    };
  }
);

//fatchUpdateUsers
interface Update {
  axiosPrivate: AxiosInstance;
  data: FormData;
  id: number;
}
export const fatchUpdateUsers = createAsyncThunk(
  "users/fatchUpdateUsers",
  async (data: Update) => {
    const response = await data.axiosPrivate.put(
      `${BASE_URL}/users/${data.id}`,
      data.data
    );

    if (response?.status == 200) {
      const res = await data.axiosPrivate.get(`${BASE_URL}/users`);
      return response.data.data;
    }
  }
);

//fatchInsertUsers
interface Insert {
  axiosPrivate: AxiosInstance;
  data: FormData;
}
export const fatchInsertUsers = createAsyncThunk(
  "users/fatchInsertUsers",
  async (data: Insert) => {
    const response = await data.axiosPrivate.post(
      `${BASE_URL}/users`,
      data.data
    );
    return response.data.data;
  }
);

//initialstate
interface InitialState {
  users: Users[];
  allusres: Users[];
  insert: number;
  count: number;
  delete: number;
  update: number;
  isLoading: boolean;
  ErrorMessage: string | null;
}

const initialState: InitialState = {
  users: sessionStorage.getItem("users") && JSON.parse(`${sessionStorage.getItem("users")}`)? JSON.parse(`${sessionStorage.getItem("users")}`): [],
  allusres: [],
  insert: 0,
  count: sessionStorage.getItem("countUsers") && JSON.parse(`${sessionStorage.getItem("countUsers")}`)? JSON.parse(`${sessionStorage.getItem("countUsers")}`): 0,
  update: 0,
  delete: 0,
  isLoading: false,
  ErrorMessage: null,
};

//slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    restartDefault: (state) => {
      state.count = 0;
      state.insert = 0;
      state.update = 0;
      state.delete = 0;
      state.isLoading = false;
      state.ErrorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      // fatchAllUsers
      .addCase(fatchAllUsers.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchAllUsers.fulfilled,
        (state, action: PayloadAction<{ users: Users[]; count: number }>) => {
          state.isLoading = false;
          state.allusres = action.payload.users;
        }
      )
      .addCase(fatchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
      })
      // fatchUser
      .addCase(fatchUsers.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchUsers.fulfilled,
        (state, action: PayloadAction<{ users: Users[]; count: number }>) => {
          state.isLoading = false;
          state.users = action.payload.users;
          state.count = action.payload.count;
        }
      )
      .addCase(fatchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
      })

      //fatchDeleteUsers
      .addCase(fatchDeleteUsers.pending, (state, action) => {
        state.isLoading = true;
        state.delete = 0;
        toast(" درخواست ثبت شد منتظر بمانید", {
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
      .addCase(
        fatchDeleteUsers.fulfilled,
        (state, action: PayloadAction<{ users: Users[]; count: number }>) => {
          state.isLoading = false;
          state.ErrorMessage = "";
          state.delete = 200;
          state.users = action.payload.users;
          state.count = action.payload.count;
          if(action.payload?.users){
            sessionStorage.setItem("users",JSON.stringify(action.payload.users))
            sessionStorage.setItem("countUsers",JSON.stringify(action.payload.count))
          }
          toast("حذف با موفقیت انجام شد", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      )
      .addCase(fatchDeleteUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.delete = 0;
        toast("درخوست حذف لغو شد دوباره امتحان کنید", {
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

      //fatchInsertUsers
      .addCase(fatchInsertUsers.pending, (state, action) => {
        state.isLoading = true;
        state.insert = 0;
        toast(" درخواست ثبت شد منتظر بمانید", {
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
      .addCase(
        fatchInsertUsers.fulfilled,
        (state, action: PayloadAction<Users>) => {
          state.isLoading = false;
          state.ErrorMessage = "";
          state.insert = 201;
          toast(`کاربر جدید اضافه شد توسط شما`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      )

      .addCase(fatchInsertUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.insert = 0;
        if (action.error.message?.endsWith("409")) {
          state.ErrorMessage = "کاربری با این مشخصات از قبل وجود دارد";
        } else if (action.error.message?.endsWith("403")) {
          state.ErrorMessage = "رمز ورود مطابقت ندارد";
        } else if (action.error.message?.endsWith("400")) {
          state.ErrorMessage = "اطلاعات وارد شده درست نمی باشد";
        } else {
          state.ErrorMessage = "لطفا بعدا دوباره امتحان کنید";
        }
        toast(`درخواست ایجاد کاربر جدید لغو شد `, {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        toast(state.ErrorMessage, {
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

      //fatchUpdateUsers
      .addCase(fatchUpdateUsers.pending, (state, action) => {
        state.isLoading = true;
        state.update = 0;
        toast(" درخواست ثبت شد منتظر بمانید", {
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
      .addCase(
        fatchUpdateUsers.fulfilled,
        (state, action: PayloadAction<Users>) => {
          state.isLoading = false;
          state.ErrorMessage = "";
          state.update = 200;
          toast("ویرایش کاربر با موفقیت انجام شد ", {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      )
      .addCase(fatchUpdateUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.ErrorMessage = action.error.message || "";
        state.update = 0;
        if (action.error.message?.endsWith("409")) {
          state.ErrorMessage = "کاربری با این مشخصات از قبل وجود دارد";
        } else if (action.error.message?.endsWith("401")) {
          state.ErrorMessage = "رمز ورود مطابقت ندارد";
        } else if (action.error.message?.endsWith("400")) {
          state.ErrorMessage = "اطلاعات وارد شده درست نمی باشد";
        } else {
          state.ErrorMessage = "لطفا بعدا دوباره امتحان کنید";
        }
        toast(" درخواست ویرایش کاربر لغو شد دوباره امتحان کنید", {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        toast(state.ErrorMessage , {
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

export const { restartDefault } = usersSlice.actions;
export default usersSlice.reducer;

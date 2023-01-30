import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Categories, CommentType, Movies, Ratings } from "../../typeing";
import { BASE_URL } from "../../axios/configApi";
import { AxiosInstance } from "axios";


//Comments
interface Option {
    movietitle: string,
    movieid: number,
    axiosPrivate: AxiosInstance
}
export const fatchComments = createAsyncThunk(
  "review/fatchComments",
  async (option: Option) => {
    const response = await option.axiosPrivate.get(
        `${BASE_URL}/review?movieid=${option.movieid}&movietitle=${option.movietitle}`
      );
    return response.data.data;
  }
);

//CommentsInsert
interface InsertComment {
    data: CommentType,
    axiosPrivate: AxiosInstance
}
export const fatchCommentsInsert = createAsyncThunk(
  "review/fatchCommentsInsert",
  async (option: InsertComment) => {
    const response = await option.axiosPrivate.post(`${BASE_URL}/review`, option.data);
    if (response?.status === 201) {
        const res = await option.axiosPrivate.get(
          `${BASE_URL}/review?movieid=${option.data.movieid}&movietitle=${option.data.movietitle}`
        );
        return res.data.data
      }
  }
);
//CommentsDelete
interface DeleteComment {
    userid: number,
    movieid: number,
    movietitle: string,
    createdAt: string,
    axiosPrivate: AxiosInstance
}
export const fatchCommentsDelete = createAsyncThunk(
  "review/fatchCommentsDelete",
  async (option: DeleteComment) => {
    const response = await option.axiosPrivate.delete(
        `${BASE_URL}/review?userid=${option.userid}&movieid=${option.movieid}&createdAt=${option.createdAt}`
      )
      if (response?.status === 200) {
        const res = await option.axiosPrivate.get(
          `${BASE_URL}/review?movieid=${option.movieid}&movietitle=${option.movietitle}`
        );
        return res.data.data
      }
  }
);

//retings
interface OptionRating {
  axiosPrivate: AxiosInstance;
  movietitle: string;
}
export const fatchRetings = createAsyncThunk(
  "review/fatchRetings",
  async (option: OptionRating) => {
    const response = await option.axiosPrivate.get(
      `${BASE_URL}/ratings?movietitle=${option.movietitle}`
    );
    return response.data.data;
  }
);

//fatchInsertRating
interface Insert {
  rated: Ratings;
  data: Movies;
  movietitle: string;
  movieid: number;
  userid: number;
  axiosPrivate: AxiosInstance;
}
export const fatchInsertRating = createAsyncThunk(
  "review/fatchInsertRating",
  async (data: Insert) => {
    const response = await data.axiosPrivate.post(
      `${BASE_URL}/ratings`,
      data.rated
    );
    if (response?.status == 200) {
      const res = await data.axiosPrivate.put(
        `${BASE_URL}/movies?title=${data.movietitle}&movieid=${data.movieid}&userid=${data.userid}`,
        data.data
      );
      if (res?.status == 200) {
        const response = await data.axiosPrivate.get(
          `${BASE_URL}/ratings?movietitle=${data.movietitle}`
        );
        return response.data.data
      }
    }
  }
);

//initialstate
interface InitialState {
  ratings: Ratings[];
  comment: CommentType[]
  insert: number 
  delete: number 
  isLoading: boolean;
  errorMessage: string;
}

const initialState: InitialState = {
  ratings: [],
  comment: [],
  insert: 0 ,
  delete: 0 ,
  isLoading: false,
  errorMessage: "",
};

//slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fatchRetings
      .addCase(fatchRetings.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchRetings.fulfilled,
        (state, action: PayloadAction<{ data: Ratings[] }>) => {
          state.isLoading = false;
          state.ratings = action.payload.data;
        }
      )
      .addCase(fatchRetings.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || "";
      })

    // fatchInsertRating
    .addCase(fatchInsertRating.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchInsertRating.fulfilled,
        (state, 
            action: PayloadAction<{ data: Ratings[] }>
        ) => {
          state.isLoading = false;
          state.ratings = action.payload.data;
        }
      )
      .addCase(fatchInsertRating.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || "";
      })

    // fatchComments
    .addCase(fatchComments.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchComments.fulfilled,
        (state, 
            action: PayloadAction<CommentType[]>
        ) => {
          state.isLoading = false;
          state.comment = action.payload;
        }
      )
      .addCase(fatchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || "";
      })
    // fatchCommentsInsert
    .addCase(fatchCommentsInsert.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchCommentsInsert.fulfilled,
        (state, 
            action: PayloadAction<CommentType[]>
        ) => {
          state.isLoading = false;
          state.comment = action.payload;
        }
      )
      .addCase(fatchCommentsInsert.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || "";
      })
    // fatchCommentsDelete
    .addCase(fatchCommentsDelete.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(
        fatchCommentsDelete.fulfilled,
        (state, 
            action: PayloadAction<CommentType[]>
        ) => {
          state.isLoading = false;
        }
      )
      .addCase(fatchCommentsDelete.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.error.message || "";
      })
  },
});

export default reviewSlice.reducer;

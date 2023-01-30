export interface Genre {
  id: number;
  name: string;
}
//

interface Categories {
  bits: number
  content: string
  id: number
  title: string
  image:staring
  username?:string
  createdAt: string 
  updatedAt: string 
}

//
export interface Movies {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  media_type?: string;
  movieid?: number;
  username?: string ;
  userid?: number;
  roleuser?: string;
  createdAt?: string;
  categories?: Categories[];
  categoryTitle?: string;
}
//
export interface Userinfo {
  role: string
  id: number
  username: string
  accessToken: string
  image?:string
}

//
export interface CommentType {
  movieid: number
  userId: number
  username: string
  movietitle: string
  content: string
  updatedAt?: string
  ratings: number
  createdAt?: string
  image?:string
}
//
export interface Ratings {
  username: string;
  movietitle: string;
  date?: string;
  ratings: number;
  userId: number;
}
//
interface Roles {
  name: string;
}
//
export interface Users {
  username: string;
  image: string;
  mobile: string;
  roleuser: string;
  email: string;
  date?: string;
  roles: Roles[];
  createdAt: string;
  updatedAt: string;
  password: string;
  id: number;
  profile: string;
}
//
export interface NewUser {
  username: string;
  image: string;
  mobile: string;
  roleuser: string;
  email: string;
  password: string;
  profile: string;
}
//
export interface Payment {
  username: string;
  month: string;
  status: boolean;
  mobile: string;
  email: string;
  account: string;
  userid: number;
}
//

export interface StateTypeAuth {
  auth: {
    accessToken: string ;
    userInfo: Userinfo | null;
    isLoading: boolean;
    message:string
    errorMessage: string;
  };
}

//
export interface StateAccessToken {
  accesstoken: {
    accessToken: string | undefined;
    isLoading: boolean;
    errorMessage: null | string;
  };
}
//

export interface Element {
  type:
    | "Bloopers"
    | "Featurette"
    | "Behind the Scenes"
    | "Clip"
    | "Trailer"
    | "Teaser";
}

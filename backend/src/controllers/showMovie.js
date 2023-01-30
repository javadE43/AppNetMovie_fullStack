import axios from "axios";
import { responce } from "../util/configResponce.js";

const baseUrl = "https://api.themoviedb.org/3/";
const apiKey = "0f03ae9e9244ff0b99b6ca724f605bad";

export const fatchMovies = async (req, res) => {
  const {movieid ,type} = req.query;
  if(!movieid){
   return responce({
      res,
      message: "Bad Request",
      code: 400,
    });
  }
  try {
    const data = await axios.get(
      `${baseUrl}${type === "tv" ? "tv" : "movie"}/${movieid}?api_key=${apiKey}&language=en-US&append_to_response=videos`
    );
    responce({
      res,
      message: "success",
      code: 200,
      data: data.data,
    });
  } catch (error) {
    responce({
      res,
      message: "Request Blocked",
      code: 500,
    });
  }
};

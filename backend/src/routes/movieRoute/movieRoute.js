import express from "express";
import { verifyToken } from "../../middleware/verifyToken.js";
import verifyRoles from "../../middleware/verifyRole.js";
import db from "../../model/index.js";
import upload from "../../middleware/uploadFile.js";

import { movieController } from "../../controllers/movieController.js";
import { validate } from "./validate.js";
import { verifyAdmin } from "../../middleware/verifyAdmin.js";
import { fatchMovies } from "../../controllers/showMovie.js";

const movieRouter = express.Router();

movieRouter.post(
  "/",
  upload.single("poster_path"),
  (req, res, next) => {
    if (!req.file) {
      req.body.poster_path = null;
    } else {
      req.body.poster_path = req.file.filename;
    }
    next();
  },
  validate.insertValid(),
  verifyToken,
  verifyRoles(db.ROLES),
  // verifyAdmin,
  movieController.insertMovie
);
movieRouter.put(
  "/",
  upload.single("poster_path"),
  (req, res, next) => {
    if (!req.file) {
      req.body.poster_path = null;
    } else {
      req.body.poster_path = req.file.filename;
    }
    next();
  },
  verifyToken,
  verifyRoles(db.ROLES),
  movieController.updateMovie
);
movieRouter.delete(
  "/",
  verifyToken,
  verifyRoles(db.ROLES),
  // verifyAdmin,
  movieController.deleteMovie
);
movieRouter.get("/allmovie", movieController.getAllmovies);
movieRouter.get("/count", movieController.getCountMovie);
movieRouter.get("/search", movieController.FilterMovies);
movieRouter.get("/movie", verifyToken, verifyRoles(db.ROLES), fatchMovies);
movieRouter.get(
  "/:userid",
  verifyToken,
  verifyRoles(db.ROLES),
  // verifyAdmin,
  movieController.getMovieByUser
);
movieRouter.get("/", movieController.getAllmovie);

export default movieRouter;

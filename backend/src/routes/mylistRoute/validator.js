import { body } from "express-validator";
import { Validatore } from "../validator.js";

export const validator = new (class ValidatorMylist extends Validatore {
  constructor() {
    super();
  }

  movieValid() {
    return [
      body("username")
        .isString()
        .withMessage("username type string")
        .notEmpty()
        .withMessage("username cannot be empty"),
      body("adult")
        .isBoolean()
        .withMessage("adult property only accepts boolean"),
      body("video")
        .isBoolean()
        .withMessage("video property only accepts boolean"),
      body("backdrop_path")
        .notEmpty()
        .withMessage("backdrop_path cannot be empty"),

      body("genre_ids")
      .isArray(),
  
      body("original_language")
        .notEmpty()
        .withMessage("original_language cannot be empty"),

      body("original_title")
        .notEmpty()
        .withMessage("original_title cannot be empty"),

      body("overview").notEmpty().withMessage("overview cannot be empty"),

      body("poster_path").notEmpty().withMessage("poster_path cannot be empty"),

      body("release_date")
        .notEmpty()
        .withMessage("release_date cannot be empty"),

      // body("media_type")
      // .notEmpty()
      // .withMessage("media_type cannot be empty"),

      body("title")
      .notEmpty()
      .withMessage("title cannot be empty"),

      body("title")
      .notEmpty()
      .withMessage("title cannot be empty"),

      body("title")
      .notEmpty()
      .withMessage("title cannot be empty"),

      body("title")
      .notEmpty()
      .withMessage("title cannot be empty"),

      body("popularity")
      .isNumeric()
      .withMessage("popularity cannot be empty"),

      body("vote_average")
      .isNumeric()
      .withMessage("vote_average cannot be empty"),

      body("id")
      .isNumeric()
      .withMessage("id cannot be empty"),

      body("vote_count")
      .isNumeric()
      .withMessage("vote_count cannot be empty"),
    ];
  }
})();

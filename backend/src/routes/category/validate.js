import { body } from "express-validator";
import { Validatore } from "../validator.js";
export const validatoreCategory = new (class ValidatoreCategory extends Validatore {
  constructor() {
    super();
  }

  createCategory() {
    return [
      body("title")
        .notEmpty()
        .withMessage("category title cannot be empty")
        .isLength({ min: 1, max: 250 })
        .withMessage(""),
      // 
      body("bits")
        .notEmpty()
        .withMessage("bits cannot be empty"),
      // 
      body("username")
        .notEmpty()
        .withMessage("Username cannot be empty"),
      // 
      body("userid")
        .notEmpty()
        .withMessage("userid cannot be empty"),
      // 
    ];
  }
  editeCategory() {
    return [
        body("userid")
        .notEmpty()
        .withMessage("userid cannot be empty"),
        //
        body("bits")
        .notEmpty()
        .withMessage("bits cannot be empty"),
    ];
  }
})();

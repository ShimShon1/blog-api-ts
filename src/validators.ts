import { body } from "express-validator";
const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({
    min: 2,
    max: 100,
  })
  .withMessage("title be between 2 and 100 characters.");
const postContentValidation = body("content")
  .isString()
  .trim()
  .isLength({
    min: 2,
  })
  .withMessage("content must have at least 2 characters.");

const commentContentValidation = body("content")
  .isString()
  .trim()
  .isLength({
    min: 2,
    max: 100,
  })
  .withMessage("content must have at between 2 and 100 characters.");

const userValidation = body("username")
  .isString()
  .trim()
  .isLength({
    min: 2,
    max: 20,
  })
  .withMessage("username must have between 2 and 20 characters.");

const passwordValidation = body("password")
  .isString()
  .trim()
  .isLength({
    min: 2,
    max: 25,
  })
  .withMessage("password must have between 2 and 25 characters.");

const isPublicValidation = body("isPublic")
  .isBoolean()
  .withMessage("isPublic must be a Boolean.");

//validate comment model
export const commentValidation = [
  userValidation,
  titleValidation,
  commentContentValidation,
];
export const postValidation = [
  isPublicValidation,
  titleValidation,
  postContentValidation,
];

export const loginValidation = [userValidation, passwordValidation];

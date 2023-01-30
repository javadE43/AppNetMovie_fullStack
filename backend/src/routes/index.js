import express from "express";
import authRouter from "./authRoute/auth.js";
import cateRouter from "./category/category.js";
import movieRouter from "./movieRoute/movieRoute.js";
import mylistRoute from "./mylistRoute/mylistRoute.js";
import payRouter from "./pay/pay.js";
import ratingsRoute from "./ratings/rating.js";
import reviewRoute from "./reviewRoute/review.js";
import subsRoute from "./subscription/subcription.js";
import transRoute from "./transaction/transaction.js";
import userRouter from "./userRoute/userRoute.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/mylist", mylistRoute);
router.use("/review", reviewRoute);
router.use("/ratings", ratingsRoute);
router.use("/payment", payRouter);
router.use("/trans", transRoute);
router.use("/account", subsRoute);
router.use("/movies", movieRouter);
router.use("/category", cateRouter);

export default router;

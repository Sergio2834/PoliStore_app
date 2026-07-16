import {
    registrati,
    accedi,
    logout,
    fetchUser,
}from "../controllers/controllerUser.js";
import express from "express";

const router = express.Router();

//inserire Swagger API
router.post("/signup", registrati);

//inserire Swagger API
router.post("/login", accedi);

//inserire Swagger API
router.get("/fetch-user", fetchUser);

//inserire Swagger API
router.post("/logout", logout);

export default router;
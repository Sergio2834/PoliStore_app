import{
    getAllFavorite,
    favoriteToggle
}from "../controllers/controllerFavorite.js";

import express from "express";

const router = express.Router();

//inserire Swagger API
router.get("/users/favorites", getAllFavorite);

//inserire Swagger API
router.post("/users/favorites/:bookId", favoriteToggle);

export default router;
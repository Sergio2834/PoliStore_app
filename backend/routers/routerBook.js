import{
    visualizzaLibri,
    visualizzaLibro,
}from "../controllers/controllerBook.js";

import express from "express";

const router = express.Router();

//inserire Swagger API
router.get("/books/:id", visualizzaLibro)

//inserire Swagger API
router.get("/books", visualizzaLibri);

export default router;



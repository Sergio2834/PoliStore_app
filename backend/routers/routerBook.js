import{
    visualizzaLibri,
    visualizzaLibro,
}from "../controllers/controllerBook.js";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Recupera un libro specifico tramite ID
 *     description: Restituisce i dettagli di un singolo libro basato sul suo ID di MongoDB.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID univoco del libro
 *     responses:
 *       200:
 *         description: Dettagli del libro recuperati con successo.
 *       404:
 *         description: Libro non trovato.
 *       500:
 *         description: Errore del server.
 */
router.get("/books/:id", visualizzaLibro)

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Recupera tutti i libri
 *     description: Restituisce un array con tutti i libri presenti nel database. Supporta la ricerca tramite il parametro query "search".
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Termine di ricerca per filtrare i libri in base al titolo (case-insensitive).
 *     responses:
 *       200:
 *         description: Lista dei libri restituita con successo.
 *       500:
 *         description: Errore del server.
 */
router.get("/books", visualizzaLibri);

export default router;



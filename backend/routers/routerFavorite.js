import{
    getAllFavorite,
    favoriteToggle
}from "../controllers/controllerFavorite.js";

import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/users/favorites:
 *   get:
 *     summary: Recupera i libri preferiti dell'utente
 *     description: Restituisce l'array dei libri preferiti dell'utente attualmente loggato. Richiede il token di autenticazione nei cookie.
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista dei preferiti recuperata con successo.
 *       401:
 *         description: Non autorizzato, effettua il login.
 *       404:
 *         description: Utente non trovato.
 *       500:
 *         description: Errore del server.
 */
router.get("/users/favorites", getAllFavorite);

/**
 * @swagger
 * /api/users/favorites/{bookId}:
 *   post:
 *     summary: Aggiunge o rimuove un libro dai preferiti
 *     description: Logica toggle che aggiunge il libro ai preferiti se non è presente, o lo rimuove se è già presente. Richiede il token JWT nei cookie.
 *     tags: [Favorites]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID del libro da aggiungere o rimuovere dai preferiti.
 *     responses:
 *       200:
 *         description: Libro aggiunto/rimosso dai preferiti con successo (messaggio di conferma).
 *       401:
 *         description: Devi effettuare il login.
 *       404:
 *         description: Utente non trovato.
 *       500:
 *         description: Errore del server.
 */
router.post("/users/favorites/:bookId", favoriteToggle);

export default router;
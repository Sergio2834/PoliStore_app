import {
    registrati,
    accedi,
    logout,
    fetchUser,
}from "../controllers/controllerUser.js";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Registra un nuovo utente
 *     description: Crea un nuovo account verificando username e password univoci, salva la password in modo sicuro e imposta il cookie di autenticazione JWT.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "mario_rossi"
 *               email:
 *                 type: string
 *                 example: "mario@email.com"
 *               password:
 *                 type: string
 *                 example: "passwordSegreta123"
 *     responses:
 *       200:
 *         description: Utente creato correttamente e autenticato.
 *       400:
 *         description: Campi obbligatori mancanti, utente/email già esistente, o altri errori di validazione.
 */
router.post("/signup", registrati);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autentica un utente esistente (Login)
 *     description: Verifica username e password dell'utente. In caso di successo, imposta il cookie JWT di sessione.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "mario_rossi"
 *               password:
 *                 type: string
 *                 example: "passwordSegreta123"
 *     responses:
 *       200:
 *         description: Accesso effettuato correttamente.
 *       400:
 *         description: Credenziali non valide.
 */
router.post("/login", accedi);

/**
 * @swagger
 * /api/fetch-user:
 *   get:
 *     summary: Recupera l'utente attualmente loggato
 *     description: Legge il cookie di sessione (token JWT) e restituisce i dati dell'utente loggato, escludendo la password.
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Dettagli utente recuperati con successo.
 *       400:
 *         description: Utente non trovato o errore nel recupero.
 *       401:
 *         description: Non autorizzato, token mancante o non valido.
 */
router.get("/fetch-user", fetchUser);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Disconnette l'utente (Logout)
 *     description: Cancella il cookie di sessione dell'utente, terminando la sua sessione.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Logout effettuato correttamente.
 */
router.post("/logout", logout);

export default router;
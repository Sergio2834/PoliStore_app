//Installa l'estensione Postman per testare il backend senza andare sul browser (min 2:57:10)//
//Installa nodemon (npm install -g (non so perchè a me è servito fare -g) nodemon) per far si che il server si riavvii automaticamente ogni volta che fai una modifica al codice (min 2:58:00)//

import express from 'express'; //Devi fare npm install express prima di eseguire questo codice//
import { connectToDB } from './config/db.js'; //importa la funzione per connettersi al database//
import dotenv from 'dotenv'; //Devi fare npm install dotenv prima di eseguire questo codice, perchè node non sa leggere file .env//
import User from "./models/user.model.js";
import Book from "./models/book.model.js";
import bcryptjs from 'bcryptjs'; //Devi fare npm install bcryptjs prima di eseguire questo codice, perchè node non sa leggere file .env//
import jwt from 'jsonwebtoken'; //Devi fare npm install jsonwebtoken prima di eseguire questo codice, perchè node non sa leggere file .env//
import cookieParser from 'cookie-parser'; //Devi fare npm install cookie-parser prima di eseguire questo codice, perchè node non sa leggere file .env//
import cors from 'cors'; //Devi fare npm install cors, cors serve per permettere al frontend di fare richieste al backend, altrimenti il browser bloccherebbe le richieste per motivi di sicurezza (CORS)//

dotenv.config(); //carica le variabili d'ambiente dal file .env, così puoi usarle nel tuo codice con process.env.NOME_VARIABILE//


const app = express();

//Middlewares
app.use(express.json()); //per far si che il server possa leggere i dati in formato JSON che arrivano dalle richieste, altrimenti non riuscirebbe a capire cosa stai mandando
app.use(cookieParser()); //per far si che il server possa leggere i cookie che arrivano dalle richieste, altrimenti non riuscirebbe a capire cosa stai mandando
app.use(cors({origin: process.env.CLIENT_URL, credentials: true})); //per permettere al frontend di fare richieste al backend, altrimenti il browser bloccherebbe le richieste per motivi di sicurezza (CORS); origin è l'url del frontend, credentials: true permette di inviare cookie insieme alle richieste//

const PORT = process.env.PORT || 5000; 

app.get("/", (req, res) => {
    res.send("Sergio gay 4!")

})

app.post("/api/signup", async (req, res) => {
    const {username, email, password } = req.body;
    console.log(username, email, password)
    try{
        if(!username || !email || !password){
            throw new Error("tutti i campi sono obbligatori");
        }

        const emailExists = await User.findOne({email});
        if(emailExists){
            return res.status(400).json({message: "Utente già esistente"});
        }

        const usernameExists = await User.findOne({username});
        if(usernameExists){
            return res
            .status(400)
            .json({message: "Questo username è già in uso, scegline un altro"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10); //hasha la password con un sale di 10, applica cioè l'algoritmo di hashing 10 volte
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // JWT

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", //il token con le info salvate scade dopo 7 giorni
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
        } 
        return res.status(200).json({user: userDoc, message: "Utente creato correttamente!"})
    }catch(error){
        res.status(400).json({message: error.message})
    }
    
});

app.post("/api/login", async (req, res) => {
    const {username, password} = req.body;
    try{
        const  userDoc = await User.findOne({username});
        if(!userDoc){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        const isPasswordValid = await bcryptjs.compareSync(
            password,
            userDoc.password
        )

        if(!isPasswordValid){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        //JWT

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", //il token con le info salvate scade dopo 7 giorni
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });
        } 
        return res.status(200).json({user: userDoc, message: "Accesso effettuato correttamente!"})
    }catch(error){
        console.log("Errore nell'accesso", error.message);
        res.status(400).json({message: error.message})
    }
});

app.get("/api/fetch-user", async (req, res) => {
    const { token } = req.cookies; //prende il token dai cookie, che è dove lo abbiamo salvato quando l'utente si è loggato o registrato

    if(!token){
        return res.status(401).json({message: "Non autorizzato, token mancante."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //verifica che il token sia valido e non scaduto, e decodifica le info salvate al suo interno
        if(!decoded){
            return res.status(401).json({message: "Non autorizzato, token non valido."});
        }

        const userDoc = await User.findById(decoded.id).select("-password"); //trova l'utente nel database usando l'id salvato nel token, e esclude la password dalla risposta
        if(!userDoc){
            return res.status(400).json({message: "Utente non trovato."});
        }

        res.status(200).json({user: userDoc});
    }catch (error){
        console.log("Errore nel recupero dell'utente", error.message);
        res.status(400).json({message: error.message});
    }     

});

app.post("/api/logout", async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({message: "Logout effettuato correttamente!"});
});

// Rotta per ottenere tutti i libri (per i caroselli del frontend)
app.get("/api/books", async (req, res) => {
    try {
        // Cerca tutti i libri e li ordina dal più recente al più vecchio
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(books); // Usiamo .json() invece di .send() per mantenere coerenza con il tuo codice
    } catch (error) {
        console.error("Errore nel recupero dei libri", error);
        res.status(500).json({ message: "Impossibile recuperare i libri" });
    }
});

// Rotta per ottenere un singolo libro tramite il suo ID (se ti serve aprire una pagina di dettaglio)
app.get("/api/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: "Libro non trovato!" });
        }
        
        res.status(200).json(book);
    } catch (error) {
        console.error("Errore nel recupero del libro", error);
        res.status(500).json({ message: "Impossibile recuperare il libro" });
    }
});

app.listen(PORT, () => {
    connectToDB(); //collega il database quando il server parte, così non devi preoccuparti di farlo manualmente ogni volta che avvii il server//
    console.log(`Server is running on http://localhost:${PORT}`); 
}) //node server.js ti fa vedere dove sta runnando il server //
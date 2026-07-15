//Installa l'estensione Postman per testare il backend senza andare sul browser (min 2:57:10)//
//Installa nodemon (npm install -g (non so perchè a me è servito fare -g) nodemon) per far si che il server si riavvii automaticamente ogni volta che fai una modifica al codice (min 2:58:00)//

import express from 'express'; 
import { connectToDB } from './config/db.js'; 
import dotenv from 'dotenv'; 
import User from "./models/user.model.js";
import Book from "./models/book.model.js";
import bcryptjs from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'; 

dotenv.config(); 

const app = express();

// CREAZIONE DEL SERVER HTTP E DI SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL, // Assicurati che questo combaci col frontend (es. http://localhost:5173)
        credentials: true
    }
});

// Middlewares
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({origin: process.env.CLIENT_URL, credentials: true})); 

const PORT = process.env.PORT || 5000; 

// --- LOGICA SOCKET.IO REAL-TIME ---
io.on('connection', (socket) => {
    
    // Quando un utente entra nella pagina di un libro
    socket.on('join-book', (bookId) => {
        socket.join(bookId); // L'utente entra nella 'stanza' del libro
        
        // Calcola quante persone ci sono in questa stanza
        const viewersCount = io.sockets.adapter.rooms.get(bookId)?.size || 0;
        
        // Invia il conteggio aggiornato a tutti quelli nella stanza
        io.to(bookId).emit('viewers-count', viewersCount);
    });

    // Quando un utente esce volontariamente dalla pagina
    socket.on('leave-book', (bookId) => {
        socket.leave(bookId);
        const viewersCount = io.sockets.adapter.rooms.get(bookId)?.size || 0;
        io.to(bookId).emit('viewers-count', viewersCount);
    });

    // Quando l'utente chiude brutalmente la scheda o cade la connessione
    socket.on('disconnecting', () => {
        // socket.rooms contiene tutte le stanze a cui l'utente era connesso prima di cadere
        for (const room of socket.rooms) {
            if (room !== socket.id) { // Ignora la stanza di default legata al singolo socket
                const viewersCount = (io.sockets.adapter.rooms.get(room)?.size || 1) - 1;
                io.to(room).emit('viewers-count', viewersCount);
            }
        }
    });
});

app.get("/", (req, res) => {
    res.send("Sergio gay 4!")
});

// --- ROTTE AUTENTICAZIONE ---

app.post("/api/signup", async (req, res) => {
    const {username, email, password } = req.body;
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
            return res.status(400).json({message: "Questo username è già in uso, scegline un altro"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10); 
        const userDoc = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", 
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
        const userDoc = await User.findOne({username});
        if(!userDoc){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        const isPasswordValid = await bcryptjs.compareSync(password, userDoc.password);

        if(!isPasswordValid){
            return res.status(400).json({message: "Credenziali non valide."});
        }

        if(userDoc){
            const token = jwt.sign({id: userDoc._id}, process.env.JWT_SECRET, {
                expiresIn: "7d", 
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
    const { token } = req.cookies; 

    if(!token){
        return res.status(401).json({message: "Non autorizzato, token mancante."});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if(!decoded){
            return res.status(401).json({message: "Non autorizzato, token non valido."});
        }

        const userDoc = await User.findById(decoded.id).select("-password"); 
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

// --- ROTTE LIBRI ---

app.get("/api/books", async (req, res) => {
    try {
        const { search } = req.query; // Prende la parola cercata dall'URL
        let query = {}; 
        if (search) {
            query = { title: { $regex: search, $options: "i" } };
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.status(200).json(books); 
    } catch (error) {
        console.error("Errore nel recupero dei libri", error);
        res.status(500).json({ message: "Impossibile recuperare i libri" });
    }
});

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

// --- ROTTE PREFERITI ---

// 1. GET: Recupera tutti i preferiti dell'utente
app.get("/api/users/favorites", async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Non autorizzato, effettua il login." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).populate('favorites');
        
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        res.status(200).json(user.favorites || []);
    } catch (error) {
        console.error("Errore nel recupero dei preferiti", error.message);
        res.status(500).json({ message: "Errore del server." });
    }
});

// 2. POST: Aggiungi o rimuovi (Toggle) un preferito
app.post("/api/users/favorites/:bookId", async (req, res) => {
    const { token } = req.cookies;
    const { bookId } = req.params;

    if (!token) {
        return res.status(401).json({ message: "Devi effettuare il login." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        if (!user.favorites) {
            user.favorites = [];
        }

        // LOGICA INTERRUTTORE (TOGGLE)
        const isAlreadyFav = user.favorites.some(id => id.toString() === bookId);
        
        if (isAlreadyFav) {
            // Rimuovi il preferito
            user.favorites = user.favorites.filter(id => id.toString() !== bookId);
            await user.save();
            return res.status(200).json({ message: "Libro rimosso dai preferiti!" });
        } else {
            // Aggiungi il preferito
            user.favorites.push(bookId);
            await user.save();
            return res.status(200).json({ message: "Libro aggiunto ai preferiti!" });
        }
    } catch (error) {
        console.error("Errore nei preferiti", error.message);
        res.status(500).json({ message: "Errore del server." });
    }
});


// --- AVVIO SERVER (Deve stare sempre alla fine!) ---
server.listen(PORT, () => {
    connectToDB(); 
    console.log(`Server is running on http://localhost:${PORT}`); 
});
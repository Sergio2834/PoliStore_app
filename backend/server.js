import express from 'express'; 
import { connectToDB } from './config/db.js'; 
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io'; 
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config(); 

//ROUTER
import routerUser from "./routers/routerUser.js";
import routerBook from "./routers/routerBook.js";
import routerFavorite from "./routers/routerFavorite.js";

const app = express();

// CREAZIONE DEL SERVER HTTP E DI SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
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

// --- 2. CONFIGURAZIONE SWAGGER ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "PoliStore API",
            version: "1.0.0",
            description: "Documentazione delle API del progetto PoliStore",
        },
        servers: [
            {
                url: "https://polistore-1g78.onrender.com",
                description: "Production Server (Render)"
            },
            {
                url: `http://localhost:${PORT}`,
                description: "Development Server (Locale)"
            }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token"
                }
            }
        }
    },
    // Percorsi in cui Swagger andrà a cercare i commenti JSDoc
    apis: ["./routers/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// --- 3. CREAZIONE DELLA ROTTA PER L'INTERFACCIA DI SWAGGER ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//COLLEGAMENTO ROTTE API
app.use("/api", routerUser);
app.use("/api", routerBook);
app.use("/api", routerFavorite);

// --- AVVIO SERVER (Deve stare sempre alla fine!) ---
server.listen(PORT, () => {
    connectToDB(); 
    console.log(`Server is running on http://localhost:${PORT}`); 
});
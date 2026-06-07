//Installa l'estensione Postman per testare il backend senza andare sul browser (min 2:57:10)//
//Installa nodemon (npm install -g (non so perchè a me è servito fare -g) nodemon) per far si che il server si riavvii automaticamente ogni volta che fai una modifica al codice (min 2:58:00)//

import express from 'express'; //Devi fare npm install express prima di eseguire questo codice//
import { connectToDB } from './config/db.js'; //importa la funzione per connettersi al database//
import dotenv from 'dotenv'; //Devi fare npm install dotenv prima di eseguire questo codice, perchè node non sa leggere file .env//

dotenv.config(); //carica le variabili d'ambiente dal file .env, così puoi usarle nel tuo codice con process.env.NOME_VARIABILE//

const app = express();

const PORT = process.env.PORT || 5000; 

app.get("/", (req, res) => {
    res.send("Sergio gay 4!")

})

app.listen(PORT, () => {
    connectToDB(); //collega il database quando il server parte, così non devi preoccuparti di farlo manualmente ogni volta che avvii il server//
    console.log(`Server is running on http://localhost:${PORT}`); 
}) //node server.js ti fa vedere dove sta runnando il server //
//Installa l'estensione Postman per testare il backend senza andare sul browser (min 2:57:10)//
import express from 'express'; //Devi fare npm install express prima di eseguire questo codice//

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
    res.send("Sergio gay!")

})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); 
}) //node server.js ti fa vedere dove sta runnando il server //
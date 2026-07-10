import mongoose from "mongoose"; //Serve a definire lo schema del modello utente e a creare il modello stesso.//

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //NUOVO CAMPO: Array di libri preferiti
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Book' // Collega questi ObjectId al modello Book
    }
});

const User = mongoose.model.User || mongoose.model("User", userSchema); //Questo è il modello utente che verrà utilizzato per interagire con la collezione degli utenti nel database MongoDB., se non lo trova usa || per creare un nuovo modello passandogli User e userSchema //
export default User;
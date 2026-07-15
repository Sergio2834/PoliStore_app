import mongoose from "mongoose";

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
    //Array di libri preferiti
    favorites: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Book' // Collega questi ObjectId al modello Book
    }
});

const User = mongoose.model.User || mongoose.model("User", userSchema);
export default User;
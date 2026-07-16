import jwt from 'jsonwebtoken'; 
import User from "../models/user.model.js";

//restitutisce tutti i prefetiti dell'utente identificato dal cookie JWT
export const getAllFavorite = async (req, res) => {
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
};

// Aggiunge o rimuove un libro dai preferiti dell'utente identificato dal cookie JWT
export const favoriteToggle = async (req, res) => {
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
};
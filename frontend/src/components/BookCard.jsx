import React, {useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from "react-router"; // Assicurati che l'import sia corretto in base al tuo router
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const BookCard = ({ book }) => {
    // 1. Estrai l'utente in cima al componente (come in SingleBook)
    const { user } = useAuthStore();
    
    const handleAddToFavorites = async (e) => {
        // 2. Blocca la navigazione accidentale quando clicchi sul bottone
       if (e && e.preventDefault) e.preventDefault(); 

        // 3. Controllo login
        if (!user) {
            toast.error("Devi essere connesso per aggiungere un libro ai preferiti.");
            return;
        }

        try {
            // 4. Chiamata al backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/favorites/${book._id}`)
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response.data.message || "Errore di connessione.";
            toast.error(errorMessage);
        }
    }

    return (
        <div className="flex flex-col gap-2 transition-shadow duration-300">
            <Link to={`/libro/${book._id}`}>
                <img
                    src={getImgUrl(book?.coverImage)}
                    alt={book?.title}
                    className="w-full h-auto aspect-[180/250] object-cover rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                />
            </Link>

            <div className="flex flex-col mt-2">
                <Link to={`/libro/${book._id}`}>
                    <h3 className="text-md font-semibold hover:text-blue-400 truncate">
                        {book?.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-400 mb-3 truncate">
                    {book?.author || 'Autore sconosciuto'}
                </p>
            </div>
        </div>
    )
}

export default BookCard;
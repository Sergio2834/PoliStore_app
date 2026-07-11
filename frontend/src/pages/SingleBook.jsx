import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useParams } from "react-router"
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const SingleBook = () => {
    const { id } = useParams(); 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchSingleBook = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/books/${id}`);
                setBook(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Errore nel recupero del libro:", error);
                setLoading(false);
            }
        };

        fetchSingleBook();
    }, [id]);
    
    const handleAddToFavorites = async (e) => {
        // Ora "user" esiste ed è leggibile perché l'hai estratto in cima al componente
        if (e && e.preventDefault) e.preventDefault();

        if (!user) {
            toast.error("Devi essere connesso per aggiungere un libro ai preferiti.");
            return;
        }

        try {
            // Chiamata al backend per salvare il preferito nel database
            const response = await axios.post(`http://localhost:5000/api/users/favorites/${book._id}`);
            toast.success(response.data.message);
            if (window.location.pathname === '/preferiti') {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);}
        } catch (error) {
            console.error(error);
            const errorMessage = error.response.data.message || "Errore di connessione.";
            toast.error(errorMessage);
        }
    }

    if (loading) return <div className="text-white p-10 text-center">Caricamento dettagli...</div>;
    if (!book) return <div className="text-white p-10 text-center">Libro non trovato!</div>;

    return (
        <div className="max-w-2xl mx-auto shadow-md p-5 text-white mt-10 bg-gray-800 rounded-lg">
            <h1 className="text-3xl font-bold mb-6">{book.title}</h1>

            <div className='flex flex-col md:flex-row gap-8'>
                <div className="flex-shrink-0">
                    <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book.title}
                        className="w-64 rounded-md shadow-lg"
                    />
                </div>

                <div className='flex flex-col justify-center mb-5'>
                    <p className="mb-2"><strong>Autore:</strong> {book.author || 'Sconosciuto'}</p>
                    <p className="mb-2 capitalize"><strong>Categoria:</strong> {book?.category || 'Generale'}</p>
                    <p className="mb-6 text-gray-300"><strong>Trama:</strong> {book.description || 'Nessuna descrizione disponibile.'}</p>

                    <button 
                        onClick={handleAddToFavorites} 
                        className= "bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-md flex w-fit items-center gap-2 transition-colors cursor-pointer"
                    >
                        {/* TAG DELL'ICONA AGGIORNATO */}
                        <Heart className="w-5 h-5"/>
                        <span>
                           Lista di lettura
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
    
}

export default SingleBook;
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from "react-router"
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

const SingleBook = () => {
    const { id } = useParams(); 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, setUser} = useAuthStore();
    const [isFavorite, setIsFavorite] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);

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

    useEffect(() => {
        if (user && user.favorites && book) {
            setIsFavorite(user.favorites.includes(book._id));
        }
    }, [user, book]);

    const handleProtectedLink = (e) => {
        if (!user) {
            e.preventDefault(); // Blocca fisicamente l'apertura del link href
            toast.error("Devi accedere o registrarti per usare questa funzione.");
        }
    };
    
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

            setIsFavorite(!isFavorite); // Cambia lo stato istantaneamente
            const updatedFavorites = isFavorite 
                ? user.favorites.filter(favId => favId !== book._id) // Rimuovi se era preferito
                : [...user.favorites, book._id];                     // Aggiungi se non lo era
            
            setUser({ ...user, favorites: updatedFavorites }); //AGGIORNA LO STATO GLOBALE --> fix bug
            toast.success(response.data.message);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response.data.message || "Errore di connessione.";
            toast.error(errorMessage);
        }
    }

    if (loading) return <div className="text-white p-10 text-center">Caricamento dettagli...</div>;
    if (!book) return <div className="text-white p-10 text-center">Libro non trovato!</div>;

    const isLongDescription = book?.description && book.description.length > 1000;

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-8 mt-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-[#191970]">{book.title}</h1>

            <div className='flex flex-col md:flex-row gap-12'>
                <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6"> {/*colonna di sinistra*/}
                    <img
                        src={getImgUrl(book?.coverImage)}
                        alt={book.title}
                        className="w-64 md:w-72 rounded-md shadow-xl object-cover"
                    />
                    <div className='flex flex-col gap-1 text-lg pt-2 '>
                    <p className="mb-3 text-lg"><strong>Autore:</strong> {book.author || 'Sconosciuto'}</p>
                    <p className="mb-3 text-lg capitalize"><strong>Categoria:</strong> {book?.category || 'Generale'}</p>
                    <p className="mb-3 text-lg"><strong>ISBN:</strong>{book?.isbn || 'Non dispnibile'}</p>
                    </div>
                </div>

                <div className='w-full md:w-2/3 lg:w-3/4 flex flex-col'> {/*colonna di destra*/}
                    <div className="flex-grow flex flex-col mb-8">
                        <h3 className="text-2xl font-bold mb-4 text-[#191970]">Descrizione:</h3>
                        <div className="relative">
                            <div className={`text-gray-700 leading-relaxed text-lg transition-all duration-300 ${!isExpanded && isLongDescription ? 'line-clamp-[10]' : ''}`}>
                                <p>{book.description || 'Nessuna descrizione disponibile.'}</p>
                            </div>
                            {!isExpanded && isLongDescription && (
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FAF0E6] to-transparent pointer-events-none"></div>
                            )}
                        </div>
                        {isLongDescription && (
                            <button 
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="flex items-center gap-1 text-[#191970] font-bold mt-2 hover:underline w-fit"
                            >
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                {isExpanded ? 'Leggi meno' : 'Leggi di più'}
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 mt-auto text-white">
                        <button 
                            onClick={handleAddToFavorites} 
                            className={`${isFavorite ? 'bg-[#A53030] hover:bg-red-700' : 'bg-[#191970] hover:bg-blue-700'} flex-1 py-4 px-2 rounded-md flex justify-center items-center gap-2 transition-colors font-bold shadow-md text-sm xl:text-base`}
                            >
                            <Heart className="w-6 h-6" flex-shrink-0 fill={isFavorite ? "currentColor" : "none"} />
                            <span className="text-center">
                                {isFavorite ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                            </span>
                        </button>

                        {book.linkAcquisto && (
                            <a 
                                href={book.linkAcquisto} 
                                onClick={handleProtectedLink}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 flex"
                            >
                                <button className={`w-full py-4 px-2 rounded-md flex justify-center items-center gap-2 transition-colors font-bold shadow-md text-sm xl:text-base ${!user ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#A53030] hover:bg-red-700'}`}>
                                    <ShoppingCart className="w-6 h-6 flex-shrink-0" />
                                    <span className="text-center">Acquista</span>
                                </button>
                            </a>
                        )}

                        {book.linkDownload && (
                            <a 
                                href={book.linkDownload} 
                                onClick={handleProtectedLink}
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex-1 flex"
                            >
                                <button className={`w-full py-4 px-2 rounded-md flex justify-center items-center gap-2 transition-colors font-bold shadow-md text-sm xl:text-base text-white ${!user ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                                    <Download className="w-6 h-6 flex-shrink-0" />
                                    <span className="text-center">PDF scaricabile</span>
                                </button>
                            </a>
                        )} 
                    </div>              
                </div>
            </div>
        </div>
    )
    
}

export default SingleBook;
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useParams } from "react-router"
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';

const SingleBook = () => {
    const { id } = useParams(); 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSingleBook = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/books/${id}`);
                const data = await response.json();
                setBook(data);
                setLoading(false);
            } catch (error) {
                console.error("Errore nel recupero del libro:", error);
                setLoading(false);
            }
        };

        fetchSingleBook();
    }, [id]);

    const handleAddToFavorites = () => {
        console.log("Aggiunto ai preferiti:", book._id);
        toast.success(`"${book.title}" aggiunto ai preferiti!`);
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
                        className="bg-blue-600 hover:bg-blue-700 py-3 px-6 rounded-md flex w-fit items-center gap-2 transition-colors"
                    >
                        {/* TAG DELL'ICONA AGGIORNATO */}
                        <Heart className="w-5 h-5" />
                        <span>Aggiungi alla lista di lettura</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SingleBook;
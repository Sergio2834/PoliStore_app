import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import BookCard from '../components/BookCard';

const SearchPage = () => {
    const { query } = useParams(); // Prende la parola cercata dall'URL
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books?search=${query}`);
                setBooks(response.data);
            } catch (error) {
                console.error("Errore nella ricerca:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    if (loading) return <div className="text-black p-10 text-center">Ricerca in corso...</div>;

    return (
        <div className="max-w-7xl mx-auto p-5 text-black mt-10">
            <h1 className="text-3xl font-bold mb-8">Risultati per: "{query}"</h1>

            {books.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-xl">Nessun libro trovato con questo titolo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {books.map(book => (
                        <div key={book._id} className="max-w-[200px]">
                            <BookCard book={book} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BookCard from '../components/BookCard'; // Assicurati che il percorso sia corretto
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router'; // O 'react-router' a seconda della tua versione

const Preferiti = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    // Se l'utente non è loggato, lo reindirizziamo alla homepage o al login
    if (!user) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/favorites`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include' // Essenziale per inviare il token
                });

                const data = await response.json();

                if (response.ok) {
                    setFavorites(data);
                } else {
                    toast.error(data.message || "Impossibile caricare i preferiti");
                }
            } catch (error) {
                console.error("Errore:", error);
                toast.error("Errore di connessione.");
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) {
        return <div className="text-white p-10 text-center">Caricamento preferiti...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-5 text-white mt-10">
            <h1 className="text-3xl font-bold mb-8">La tua Lista di Lettura</h1>
            
            {favorites.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                    <p className="text-xl">Non hai ancora aggiunto libri ai preferiti.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map((book) => (
                        // Riutilizziamo la tua card!
                        <BookCard key={book._id} book={book} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Preferiti;
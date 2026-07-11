import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react"; //importato lo slider da swiper.js : min 50:16 del video// 
import "swiper/css";
import BookCard from '../components/BookCard'; // Assicurati che il percorso sia corretto
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router'; // O 'react-router' a seconda della tua versione
import axios from 'axios';

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
                const response = await axios.get(`http://localhost:5000/api/users/favorites`); 
                setFavorites(response.data);
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
                <Swiper slidesPerView={"auto"} spaceBetween={20} className="mySwiper">
                    {favorites.map((book) => (
                    <SwiperSlide key={book._id} className="max-w-[200px]">
                        <BookCard book={book} />
                    </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    );
};

export default Preferiti;
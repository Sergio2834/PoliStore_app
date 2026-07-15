import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from "swiper/react"; //importato lo slider da swiper.js : min 50:16 del video// 
import "swiper/css";
import BookCard from '../components/BookCard';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router';
import axios from 'axios';

const Preferiti = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, fetchingUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        // Se non stiamo più caricando i dati utente e l'utente è null, allora lo reindirizziamo
        if (!fetchingUser && !user) {
            navigate("/");
        }
    }, [user, fetchingUser, navigate]);

    

    useEffect(() => {
        if (!user) return;
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
    }, [user]);

    if (fetchingUser || loading) {
        return <div className="text-black p-10 text-center">Caricamento preferiti...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto p-5 text-[#191970] mt-10">
            <h1 className="text-3xl font-bold mb-8">I tuoi preferiti</h1>
            
            {favorites.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
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
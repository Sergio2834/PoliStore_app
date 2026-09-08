import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Download, ChevronDown, ChevronUp, Eye, MessageCircle, X } from 'lucide-react';
import { useParams } from "react-router"
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { io } from 'socket.io-client';

const SingleBook = () => {
    const { id } = useParams(); 
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, setUser} = useAuthStore();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [viewers, setViewers] = useState(1);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState ("");
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        const fetchSingleBook = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`);
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
    if (!book) return;

    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    setSocket(newSocket);

    newSocket.emit('join-book', book._id);

    newSocket.on('viewers-count', (count) => {
        setViewers(count);
    });

    newSocket.on('receive-message', (messageData) => {
        setMessages((prev) => [...prev, messageData]);
    });

     return () => {
        newSocket.emit('leave-book', book._id);
        newSocket.disconnect();
    };
}, [book]);

const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() !== "" && user) {
        const messageData = {
            bookId: book._id,
            username: user.username,
            text: currentMessage,
            time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
        };
        
        socket.emit('send-message', messageData);
        setCurrentMessage(""); 
    }
};

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
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/favorites/${book._id}`);

            setIsFavorite(!isFavorite);
            const updatedFavorites = isFavorite 
                ? user.favorites.filter(favId => favId !== book._id)
                : [...user.favorites, book._id];
            
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

            <div className="flex items-center gap-2 text-gray-500 font-medium mb-10">
                <Eye className="w-5 h-5 text-green-600 animate-pulse" />
                <span>
                    {viewers} {viewers === 1 ? 'persona sta' : 'persone stanno'} guardando questo libro
                </span>
            </div>
            
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
                    <p className="mb-3 text-lg"><strong>ISBN:</strong> {book?.isbn || 'Non dispnibile'}</p>
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
                            <Heart className="w-6 h-6 flex-shrink-0" fill={isFavorite ? "currentColor" : "none"} />
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
            {/* Bottone Fluttuante */}
    <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-[#191970] text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-colors z-40 flex items-center gap-2 cursor-pointer"
    >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden md:inline font-bold">Chat Live</span>
    </button>

    {/* Pannello Laterale */}
    <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="bg-[#191970] text-white font-bold py-4 px-4 flex justify-between items-center shadow-md z-10">
            <span className="text-lg">Live Chat Studenti</span>
            <button onClick={() => setIsChatOpen(false)} className="hover:text-gray-300 cursor-pointer">
                <X className="w-6 h-6" />
            </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-[#FAF0E6] flex flex-col gap-3">
            {messages.length === 0 ? (
                <p className="text-gray-500 text-sm text-center my-auto">Nessun messaggio. Inizia tu la conversazione!</p>
            ) : (
                messages.map((msg, index) => (
                    <div key={index} className={`flex flex-col ${msg.username === user?.username ? 'items-end' : 'items-start'}`}>
                        <span className="text-xs text-gray-500 mb-1">{msg.username} • {msg.time}</span>
                        <div className={`py-2 px-3 rounded-lg max-w-[85%] break-words ${msg.username === user?.username ? 'bg-blue-200 text-blue-900 rounded-tr-none' : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))
            )}
        </div>

        <form onSubmit={sendMessage} className="flex p-3 border-t border-gray-200 bg-white">
            <input 
                type="text" 
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder={user ? "Scrivi un messaggio..." : "Accedi per chattare"}
                disabled={!user}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#191970] disabled:bg-gray-100 text-black"
            />
            <button 
                type="submit" 
                disabled={!user || currentMessage.trim() === ""}
                className="bg-[#191970] text-white px-5 py-3 rounded-r-md font-bold disabled:bg-gray-400 cursor-pointer"
            >
                Invia
            </button>
        </form>
    </div>
        </div>
    )
    
}

export default SingleBook;
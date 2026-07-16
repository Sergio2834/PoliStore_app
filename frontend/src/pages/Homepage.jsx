import React, {useState, useEffect} from 'react';
import Hero from '../components/Hero';
import CardList from '../components/CardList';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';
import { Loader } from 'lucide-react';

const Homepage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chiamata al database quando la pagina viene caricata
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books`);
                const data = await response.json();
                setBooks(data);
                setLoading(false);
            } catch (error) {
                console.error("Errore nel caricamento dei libri:", error);
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    if (loading) return( 
        <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
            <Loader className="w-10 h-10 animate-spin text-[#191970]" />
            <p className="mt-4 text-lg font-medium text-gray-600">Caricamento libri...</p>
        </div>);

    // Estraiamo tutte le categorie uniche dai libri ricevuti
    const categories = [...new Set(books.map(book => book.category || 'Generale'))];

    return (
        <div className='p-5'>
            <Hero />
            
            {/* Cicliamo sulle categorie e creiamo un carosello per ognuna */}
            {categories.map((category, index) => {
                // Filtriamo solo i libri che appartengono a questa specifica categoria
                const categoryBooks = books.filter(book => (book.category || 'Generale') === category);
                
                return (
                    <CardList 
                        key={index} 
                        title={category} 
                        books={categoryBooks} 
                    />
                );
            })}
            <Footer />
        </div>
    )
}
    
export default Homepage;
import React, {useState, useEffect} from 'react';
import Hero from '../components/Hero';
import CardList from '../components/CardList';
import Footer from '../components/Footer';

const Homepage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chiamata al database quando la pagina viene caricata
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                // Assicurati che l'URL punti al tuo backend (porta 5000)
                const response = await fetch('http://localhost:5000/api/books');
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
    if (loading) return <div className='text-white p-5 text-center mt-10'>Caricamento libri...</div>;

    // Estraiamo tutte le categorie uniche dai libri ricevuti
    // Se un libro non ha categoria, lo mettiamo in "Generale"
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
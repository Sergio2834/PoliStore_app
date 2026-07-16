import Book from "../models/book.model.js";

//Visualizzazione completa libri: vengono visualizzati tutti i libri presenti all'interno del DB 
export const visualizzaLibri = async (req, res) => {
    try {
        const { search } = req.query; // Prende la parola cercata dall'URL
        let query = {}; 
        if (search) {
            query = { title: { $regex: search, $options: "i" } };
        }

        const books = await Book.find(query).sort({ createdAt: -1 });
        res.status(200).json(books); 
    } catch (error) {
        console.error("Errore nel recupero dei libri", error);
        res.status(500).json({ message: "Impossibile recuperare i libri" });
    }
};

//Visualizzazione libro specifico: viene visualizzato il libro specifico relativo all'id 
export const visualizzaLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        
        if (!book) {
            return res.status(404).json({ message: "Libro non trovato!" });
        }
        
        res.status(200).json(book);
    } catch (error) {
        console.error("Errore nel recupero del libro", error);
        res.status(500).json({ message: "Impossibile recuperare il libro" });
    }
};


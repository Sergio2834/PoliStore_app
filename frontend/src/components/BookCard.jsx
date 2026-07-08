import React from 'react';
import { Heart } from 'lucide-react';
import {Link} from "react-router" //importato react router (per installarlo fai npm install react-router)
import toast from 'react-hot-toast';
import { getImgUrl } from '../utils/getImgUrl';

const BookCard = ({ book }) => {

    const handleAddToFavorites = () => {
        // Qui in futuro ci sarà la chiamata API al backend
        console.log("Aggiunto ai preferiti il libro con ID:", book._id);
        toast.success(`"${book.title}" aggiunto ai preferiti!`);
    }

    return (
        <div className="flex flex-col gap-2 transition-shadow duration-300">
            <Link to={`/libro/${book._id}`}>
                <img
                    src={getImgUrl(book?.coverImage)}
                    alt={book?.title}
                    className="h-64 w-full object-cover rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                />
            </Link>

            <div className="flex flex-col mt-2">
                <Link to={`/libro/${book._id}`}>
                    <h3 className="text-md font-semibold hover:text-blue-400 truncate">
                        {book?.title}
                    </h3>
                </Link>
                <p className="text-sm text-gray-400 mb-3 truncate">
                    {book?.author || 'Autore sconosciuto'}
                </p>
                
                <button 
                    onClick={handleAddToFavorites}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                    <Heart className="w-5 h-5" /> 
                    <span className="text-sm font-medium">Preferiti</span>
                </button>
            </div>
        </div>
    )
}

export default BookCard;
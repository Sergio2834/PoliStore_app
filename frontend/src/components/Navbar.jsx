import React from 'react'
import { Link } from 'react-router'
import { Search, ShoppingCart, Heart } from 'lucide-react'
import Logo from "../assets/logo.png";
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import { HelpCircle, Settings, LogOut } from 'lucide-react';
import {toast} from 'react-hot-toast';

const Navbar = () => {
    const {user, logout} = useAuthStore();
    const [showMenu, setShowMenu] = useState(false);
    const avatarUrl = user 
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.username)}`: "";
    const handleLogout = async () => {
        const {message} = await logout();
        toast.success(message);
        setShowMenu(false);
    };

    return (
        <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap"> 
        {/*sfondo nero e testo grigio chiaro; justify between distribuisce lo spazio mettendo il primo elemento tutto a sinistra e l'ultimo tutto a destra; 
        allinea al centro verticalmente tutti gli elementi padding cioè spaziatura interna sui 4 lati pari a 1rem cioè 16px; altezza di 20; dimensione font 14px e 15px a partire da schermi medi; font medium; text-nowrap impedisce che il testo vada a capo*/}
            
            <Link to={"/"}> {/*Apre una nuova pagina quando si clicca sul logo*/}
            <img src={Logo} alt="Logo" className="w-24 cursor-pointer brightness-125" /> {/*imposta la larghezza a 96px, cambia il cursore in pointer quando si passa sopra e aumenta la luminosità del logo del 25%*/}
            </Link> 
            
            <ul className="hidden xl:flex space-x-6"> {/*di default nasconde la lista e la mostra solo su schermi extra large; space-x-6 aggiunge uno spazio orizzontale di 1.5rem tra gli elementi della lista*/}
                <li className="cursor-pointer hover:text-[#e50914]">Home</li> {/*cursore a manina e quando si passa sopra cambia il colore del testo in rosso*/}
                <li className="cursor-pointer hover:text-[#e50914]">Libri di Avventura</li>
                <li className="cursor-pointer hover:text-[#e50914]">Romanzi Gialli</li>
                <li className="cursor-pointer hover:text-[#e50914]">Thriller</li>
                <li className="cursor-pointer hover:text-[#e50914]">Per bambini</li>
                <li className="cursor-pointer hover:text-[#e50914]">Nuove uscite</li>
                <li className="cursor-pointer hover:text-[#e50914]">Bestseller</li>
            </ul>

            <div className="flex items-center space-x-4 relative"> 
                <div className="relative hidden md:inline-flex"> {/*relative necessario per sovrapporre l'icona di ricerca all'input di testo; space-x-4 aggiunge uno spazio orizzontale di 1rem tra gli elementi; di default nasconde il div e lo mostra solo su schermi medi*/}
                    <input 
                        type="text"
                        className="bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none" /*rounded-full rende l'input completamente arrotondato; min-w-72 imposta una larghezza minima di 18rem; pr-10 aggiunge un padding a destra di 2.5rem per fare spazio all'icona di ricerca; outline-none rimuove il bordo di focus predefinito*/
                        placeholder='Cerca...' />
                    <Search className="absolute top-2 right-4 w-5 h-5" /> {/*posizione assoluta per sovrapporre l'icona all'input; top-2 posiziona l'icona a 0.5rem dall'alto; right-4 posiziona l'icona a 1rem da destra; w-5 e h-5 impostano la larghezza e l'altezza dell'icona a 1.25rem*/}
                
                </div>
                <Link to={"/preferiti"}> {/*Apre una nuova pagina quando si clicca sul pulsante del carrello*/}
                
                <button className='flex justify-center items-center h-9 bg-white text-black py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'>
                    <Heart className="mr-2 w-4 h-5 md:w-5 md:h-5" />Preferiti
                </button>
                </Link>

                {!user ? (<Link to={"/signin"}> {/*Apre una nuova pagina quando si clicca sul pulsante di accesso*/}
                <button className="border bg-[#e50914] flex justify-center items-center border-[#333333] h-9 rounded-full py-2 px-4 cursor-pointer">
                Accedi
                </button>
                </Link> ) : (
                    <div className="text-white">
                        <img src={avatarUrl} 
                        alt="" 
                        className = "w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer" 
                        onClick={() => setShowMenu(!showMenu)}
                        />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
                    </div> /*per fare in modo che quando l'utente è loggato nella navbar non appaia il pulsante accedi bensì il nome dell'utente (appare l'avatar con le iniziali)*/)}
            </div>
        </nav>
  )
}

export default Navbar 
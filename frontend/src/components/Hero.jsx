import { ShoppingCart, Wallet } from 'lucide-react'
import HeroBg from '../assets/book_image1.jpg' //importa immagini dalla cartella asset, ho fatto una prova fast col piccolo principe//
const Hero = () => {
    return (
        <div className='text-black relative'> {/*modifica del colore del testo*/}
            <img src={HeroBg} alt="bg-img" className='w-full h-[300px]' /> {/*modifica dell'immagine, da modificare*/}

            <div className='flex space-x-2 md:space-x-4 absolute bottom-3 left-4 md:bottom-8 md:left-10 font-medium'> {/*modifica del posizionamento del testo*/}
                <button className='flex justify-center items-center bg-black hover:bg-gray-200 text-[#e50000] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'><Wallet className="mr-2 w-4 h-5 md:w-5 md:h-5" />Acquista ora</button> {/*aggiungi un pulsante con scritto "Acquista ora" e uno con "Metti nel carrello", con icone prese da Lucid react*/}
                <button className='flex justify-center items-center bg-white text-black py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'><ShoppingCart className="mr-2 w-4 h-5 md:w-5 md:h-5" />Metti nel carrello</button>
            </div>            
        </div>
    )
}
    
export default Hero
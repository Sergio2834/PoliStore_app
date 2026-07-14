import { ShoppingCart, Wallet, Heart, Link2, BookOpenCheck, BookSearch, UserPlus } from 'lucide-react'
import bannerImg from '../assets/banner.png' //importa immagini dalla cartella asset, ho fatto una prova fast col piccolo principe//
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router';
const Hero = () => {
    const {user} = useAuthStore();
   return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
         <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="" />
        </div>
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-4xl text-2xl font-medium mb-7'>{user ? `Benvenuto, ${user.username}` : "Tieni traccia dei tuoi libri preferiti"}</h1>
            <ul className='flex flex-col gap-2 mb-10'>
                <li className='flex items-center gap-2'>
                    <Heart className='w-6 h-6' /> 
                    <span className='text-lg'>Aggiungi facilmente dei libri ai tuoi preferiti</span>
                </li>
                <li className='flex items-center gap-2'>
                    <Link2 className='w-6 h-6' /> 
                    <span className='text-lg'>Link diretto all'acquisto del libro</span>
                </li>
                <li className='flex items-center gap-2'>
                    <BookOpenCheck className='w-6 h-6' /> 
                    <span className='text-lg'>Leggi la trama di nuovi libri con un solo click</span>
                </li>
                <li className='flex items-center gap-2'>
                    <BookSearch className='w-6 h-6' /> 
                    <span className='text-lg'>Trova facilmente libri digitando, anche solo in parte, il suo nome</span>
                </li>
            </ul>

            <div className='flex flex-wrap gap-4'>
                {!user && (
                    <Link to={"/signup"}>
                        <button className='flex justify-center items-center bg-[#191970] hover:bg-blue-700 text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'>
                            <UserPlus className="mr-2 w-4 h-5 md:w-5 md:h-5" />CREA UN ACCOUNT GRATUITAMENTE
                        </button>
                    </Link>)
                }
            </div>
        </div>

       
    </div>
  )
}
    
export default Hero
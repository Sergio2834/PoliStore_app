import { ShoppingCart, Wallet } from 'lucide-react'
import bannerImg from '../assets/banner.png' //importa immagini dalla cartella asset, ho fatto una prova fast col piccolo principe//
const Hero = () => {
   return (
    <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
         <div className='md:w-1/2 w-full flex items-center md:justify-end'>
            <img src={bannerImg} alt="" />
        </div>
        
        <div className='md:w-1/2 w-full'>
            <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Releases This Week</h1>
            <p className='mb-10'>It's time to update your reading list with some of the latest and greatest releases in the literary world. From heart-pumping thrillers to captivating memoirs, this week's new releases offer something for everyone</p>

            <div className='flex flex-wrap gap-4'>
                <button className='flex justify-center items-center bg-black hover:bg-gray-200 text-[#e50000] py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'><Wallet className="mr-2 w-4 h-5 md:w-5 md:h-5" />Acquista ora</button> {/*aggiungi un pulsante con scritto "Acquista ora" e uno con "Metti nel carrello", con icone prese da Lucid react*/}
                <button className='flex justify-center items-center bg-white text-black py-3 px-4 rounded-full cursor-pointer text-sm md:text-base'><ShoppingCart className="mr-2 w-4 h-5 md:w-5 md:h-5" />Metti nel carrello</button>
            </div>
        </div>

       
    </div>
  )
}
    
export default Hero //da vedere l'altro video min 1:30:00 https://youtu.be/pgw2KPfgK1E //
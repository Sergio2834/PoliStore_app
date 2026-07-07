import React from "react"; //per le nuove uscite, visitati di recente ecc//
import { Swiper, SwiperSlide } from "swiper/react"; //importato lo slider da swiper.js : min 50:16 del video// 
import "swiper/css";
import BookCard from "./BookCard"

const CardList = ({title, books}) => {
    // Se non ci sono libri in questa categoria, non renderizziamo nulla
  if (!books || books.length === 0) return null;

  return (  
   <div className="text-white md:px-4 mb-8">
     {/* Mostriamo il nome della categoria in maiuscoletto */}
     <h2 className="pt-10 pb-5 text-xl font-bold capitalize">{title}</h2>
    
      <Swiper slidesPerView={"auto"} spaceBetween={15} className="mySwiper">
       {books.map((book) => (
        <SwiperSlide key={book._id} className="max-w-[200px]"> {/* Larghezza fissa per le card dello swiper */}
            
            {/* Passiamo i dati del singolo libro al componente BookCard */}
            <BookCard book={book} />
        
        </SwiperSlide>      
       ))}
      </Swiper>
    
     </div>
 );
       
};

export default CardList;
import React from "react"; //per le nuove uscite, visitati di recente ecc//
import CardImg from "../assets/book_image1.jpg"
import { Swiper, SwiperSlide } from "swiper/react"; //importato lo slider da swiper.js : min 50:16 del video// 
import "swiper/css";


const CardList = () => {
    const data = [ //caselle dello swiper//
    {
      id: 1,
      title: "Card 1",
      description: "Description for Card 1",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Card 2",
      description: "Description for Card 2",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },{
      id: 3,
      title: "Card 3",
      description: "Description for Card 3",
      imageUrl: "https://via.placeholder.com/150",
    },
  ];
 
 
  return (  
   <div className="text-white md:px-4">
     <h2 className="pt-10 pb-5 text-lg font-medium">Nuove uscite</h2>
    
      <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
       {data.map((item, index) => (
        <SwiperSlide key={index} className="max-w-72"> {/*logica dello swiper modificata//*/}
            <img src={CardImg} alt="" className="h-44 w-full object-center object-cover"/>
            <p className="text-center pt-2">Un libro veramente fiko, mai quanto Sergio</p>
        </SwiperSlide>      
        
       ))}
      </Swiper>
    
     </div>
 );
       
};

export default CardList;
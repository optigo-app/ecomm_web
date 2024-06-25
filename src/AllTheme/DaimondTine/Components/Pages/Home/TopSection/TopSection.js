import React from 'react'
import './TopSection.modul.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { storImagePath } from '../../../../../../utils/Glob_Functions/GlobalFunction';


const sliderData = [
    {
        imageUrl: "/Diaomndtine/HomePage/MainBanner/Images/HomepageMainBanner1.jpg",
    },
    {
        imageUrl: "/Diaomndtine/HomePage/MainBanner/Images/HomepageMainBanner2.jpg",
    },
    {
        imageUrl: "/Diaomndtine/HomePage/MainBanner/Images/HomepageMainBanner3.jpg",
    },
];

const TopSection = () => {
    return (
        <div className='dt_topSectionMain'>
            <Swiper
                pagination={{ clickable: false }}
                className="mySwiper"
                loop={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                modules={[Autoplay]}
            >
                {sliderData.map((slide, index) => (
                    <SwiperSlide key={index}>
                        <img src={storImagePath() + slide.imageUrl} alt={`Slide ${index}`} style={{ width: '100%', height: '100%', minHeight: '700px',maxHeight: "800px", objectFit: 'cover' }} loading='eager' />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="dt_imageContainer">
                <img src={`${storImagePath()}/Diaomndtine/HomePage/Promo/Banner/PromoBanner1.png`} className="dt_centeredImg" alt="Diamondtine Banner" />
            </div>
        </div>
    )
}

export default TopSection
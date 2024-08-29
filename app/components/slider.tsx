"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';

const images = [
    "/img-1.png",
    "/img-2.png",
    "/img-3.png",
    "/img-4.png",
    "/img-5.png",
    "/img-6.png",
    "/img-7.png",
]

export const Slider = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

      // Function to toggle fullscreen mode
    const handleFullScreen = (image: string) => {
        const imageElement = document.getElementById(`slide-image-${activeIndex}`);
        if (imageElement?.requestFullscreen) {
            imageElement.requestFullscreen();
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = ((event.pageX - left) / width) * 100;
        const y = ((event.pageY - top) / height) * 100;

        event.currentTarget.style.transformOrigin = `${x}% ${y}%`;
    };

    return (
        <div className="mt-6 mb-20 w-[95%] md:w-[70%] lg:w-[45%] mx-auto">
            <Swiper
                modules={[Navigation, Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                className="mb-4 w-full h-[450px] md:h-[600px] border rounded"
                navigation
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className='w-full h-full cursor-pointer'>
                        <div 
                            className="w-full h-full overflow-hidden relative"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                            style={{ transition: 'transform 0.3s ease-in-out' }}
                        >
                            <Image
                                width={1500}
                                height={1500}
                                src={image}
                                alt={`Slide ${index}`}
                                className="w-full h-full object-cover rounded"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails Slider */}
            <Swiper
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[Navigation, Thumbs]}
                navigation
                className="h-24 md:h-28"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="relative group cursor-pointer">
                        <img
                            src={image}
                            alt={`Thumbnail ${index}`}
                            className={`w-full h-full object-cover ${
                                index === activeIndex ? 'border-2 border-white' : ''
                            }`}
                        />
                        <div className={`absolute inset-0 bg-white transition-opacity duration-300 ${
                            index === activeIndex ? 'opacity-80' : 'opacity-0 group-hover:opacity-40'
                        }`}></div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

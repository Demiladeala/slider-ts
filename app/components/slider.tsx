"use client"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import { SlSizeFullscreen } from 'react-icons/sl';
import { VscClose } from 'react-icons/vsc';
import { MdOutlineFullscreen } from 'react-icons/md';
import { BiSolidZoomIn } from 'react-icons/bi';
import { AiOutlineZoomIn } from 'react-icons/ai';

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
    const [isMiniFullScreen, setIsMiniFullScreen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showFullText, setShowFullText] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleFullScreen = () => {
        setIsMiniFullScreen(!isMiniFullScreen);
    };

    useEffect(() => {
        const handleKeydown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isFullScreen) {
                exitFullScreen();
            }
        };

        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, [isFullScreen]);

    const enterFullScreen = () => {
        if (sliderRef.current && !isFullScreen) {
            sliderRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullScreen(true);
        }
    };
    
    const exitFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit full-screen mode: ${err.message}`);
            });
        }
        setIsFullScreen(false);
    };
    

    const handleFullViewScreen = () => {
        if (isFullScreen) {
            exitFullScreen();
        } else {
            enterFullScreen();
        }
    };

    const handleZoom = () => {
        setZoomScale(zoomScale === 1 ? 1.5 : 1);
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = ((event.pageX - left) / width) * 100;
        const y = ((event.pageY - top) / height) * 100;

        event.currentTarget.style.transformOrigin = `${x}% ${y}%`;
    };

    return (
        <>
        <div className="mt-6 mb-20 w-[95%] md:w-[70%] lg:w-[45%] mx-auto">
            <Swiper
                modules={[Navigation, Thumbs]}
                thumbs={{ swiper: thumbsSwiper }}
                className="mb-4 w-full h-[450px] md:h-[600px] border rounded swiper-container"
                navigation
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className='w-full h-full cursor-pointer swiper-slide'>
                        <div 
                            className="w-full h-full overflow-hidden relative"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.5)'}
                            style={{ transition: 'transform 0.3s ease-in-out' }}
                        >
                            <Image
                                width={1000}
                                height={1000}
                                src={image}
                                alt={`Slide ${index}`}
                                loading="lazy"
                                className="w-full h-full object-cover rounded"
                                sizes="(max-width: 600px) 480px, (max-width: 1200px) 800px, 1000px"
                            />
                        </div>
                        {index === activeIndex && (
                           <div className='w-fit h-20 fixed bottom-0 left-0 flex items-start'>
                             <div
                                onMouseEnter={() => setShowFullText(true)}
                                onMouseLeave={() => setShowFullText(false)}
                                className={` w-fit ml-4 mt-4 bg-gray-50 text-gray-800 p-4 
                                flex items-center gap-1 rounded-full cursor-pointer transition-transform duration-300`}
                                onClick={handleFullScreen}
                            >
                                <SlSizeFullscreen size={16}/>
                                {showFullText && <span className="ml-2 text-xs">Click to Enlarge</span>}
                            </div>
                           </div>
                        )}
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
                className="h-24 md:h-28 swiper-container"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="relative group cursor-pointer swiper-slide">
                        <Image
                            width={300}
                            height={300}
                            src={image}
                            alt={`Thumbnail ${index}`}
                            loading="lazy"
                            sizes="(max-width: 600px) 480px, (max-width: 1200px) 800px, 1500px"
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

        {/* Fullscreen Overlay */}
        {isMiniFullScreen && (
            <div 
            ref={sliderRef}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center md:p-4">
                {zoomScale === 1 && <div className="z-[1] absolute inset-0"
                onClick={handleFullScreen}></div>}

                <div className={`absolute top-4 left-4 text-gray-50
                    ${zoomScale === 1 ? "z-[2]" : "z-[3]"}`}>
                    {activeIndex + 1}/{images.length}
                </div>
                <div className={`absolute top-4 right-4 flex space-x-4 text-gray-50
                    ${zoomScale === 1 ? "z-[2]" : "z-[3]"}`}>
                    <AiOutlineZoomIn size={20} onClick={handleZoom} className='cursor-pointer'/>
                    <MdOutlineFullscreen size={20} onClick={handleFullViewScreen}  className='cursor-pointer'/>
                    {/* <IoIosShareAlt size={20} /> */}
                    <VscClose size={20} onClick={handleFullScreen} className="cursor-pointer" />
                </div>
                <div className={`absolute left-4 bottom-4 text-gray-50
                    ${zoomScale === 1 ? "z-[2]" : "z-[3]"}`}>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    >
                        Prev
                    </button>
                </div>
                <div className={`absolute right-4 bottom-4 text-gray-50
                     ${zoomScale === 1 ? "z-[2]" : "z-[3]"}`}>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    >
                        Next
                    </button>
                </div>

                <div className={`z-[2] relative w-full bg-black
                    ${zoomScale === 1.5 ? "h-full md:h-full" : "h-[50vh] md:h-[90vh] md:w-[50%]"}`}>
                    <Image
                        width={1500}
                        height={1500}
                        src={images[activeIndex]}
                        alt={`Slide ${activeIndex}`}
                        onClick={handleZoom}
                        className={`w-full h-full cursor-zoom-in transition-transform duration-300
                        ${zoomScale === 1.5 ? "object-contain" : "object-cover"}`}
                        loading='lazy'
                        style={{ transform: `scale(${zoomScale})` }}
                    />
                   
                </div>
            </div>
        )}
        </>
    );
};

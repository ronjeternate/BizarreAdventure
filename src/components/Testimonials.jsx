import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa6';
import { db } from '../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
            const fetchedTestimonials = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("Real-time fetched testimonials:", fetchedTestimonials); // Debugging

            const filteredTestimonials = fetchedTestimonials.filter(
                testimonial => testimonial.shown === true  // Ensure it works with both types
            );

            setTestimonials(filteredTestimonials);
        }, (error) => {
            console.error("Error fetching real-time testimonials: ", error);
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const breakpointsResponsive = {
        '@0.00': { slidesPerView: 1, spaceBetween: 10 },
        '@0.75': { slidesPerView: 2, spaceBetween: 20 },
        '@1.00': { slidesPerView: 3, spaceBetween: 10 },
        '@1.50': { slidesPerView: 3, spaceBetween: 30 },
    };

    const handleSwiperEvents = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <div className='w-full h-full space-y-5 relative lg:px-24 md:px-16 sm:px-7 px-4 flex items-center justify-center flex-col'>
            <div className="w-full flex items-center justify-between">
                <h2 className="text-2xl text-black font-semibold opacity-0">
                    Feedback from our customers!
                </h2>
                <div className="flex items-center gap-6">
                    <button className={`custom-prev text-neutral-50 bg-blue-900 hover:bg-blue-950 p-2 rounded-full z-10 ${isBeginning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isBeginning}>
                        <FaChevronLeft size={20} />
                    </button>
                    <button className={`custom-next text-neutral-50 bg-blue-900 hover:bg-blue-950 p-2 rounded-full z-10 ${isEnd ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} disabled={isEnd}>
                        <FaChevronRight size={20} />
                    </button>
                </div>
            </div>
            <div className="w-full py-2">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={5}
                    navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
                    breakpoints={breakpointsResponsive}
                    onSlideChange={(swiper) => handleSwiperEvents(swiper)}
                    onInit={(swiper) => handleSwiperEvents(swiper)}
                    modules={[Navigation]}
                    className="mySwiper p-1 ![&_.swiper-wrapper]:!ease-in-out ![&_.swiper-wrapper]:!duration-300"
                >
                    {testimonials.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className="w-full h-55 p-8 space-y-10 group bg-blue-950/10 rounded-xl border-2 border-blue-950">
                                <p className="text-black text-base font-normal line-clamp-3 overflow-hidden">
                                    {item.desc}
                                </p>
                                <div className="w-full flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={item.img} alt={item.name} className="w-12 h-12 object-center object-cover rounded-full border" />
                                        <div className="space-y-1">
                                            <p className="text-black text-base font-semibold">{item.name}</p>
                                            <p className="text-black text-xs font-normal italic">{item.user || item.name}  from {item.platform|| "Bizarre Scents"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-500/5 border border-yellow-500 rounded-full px-2 py-1">
                                        <FaStar className='text-yellow-600 text-sm' />
                                        <p className="text-xs text-yellow-600">{item.rating}</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className='pt-20'>
                <a href="https://www.instagram.com/stories/highlights/18024623359877698/" target='_blank' className="p-5 pl-10 pr-10 bg-blue-950 text-white font-[Aboreto] tracking-[.2em] hover:bg-blue-950/90">
                    View more testimonials
                </a>
            </div>
        </div>
    );
};

export default Testimonials;

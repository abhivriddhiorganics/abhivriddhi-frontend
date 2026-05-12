import { useEffect, useState, useRef } from 'react';
import { fetchAllReviews } from '../../services/api';

export default function TestimonialSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScroll = (e) => {
    if (!isMobile || reviews.length === 0) return;

    const { scrollLeft } = e.target;
    const itemWidth = e.target.querySelector('div')?.offsetWidth || 300;
    const gap = 16; // gap-4
    const index = Math.round(scrollLeft / (itemWidth + gap));

    if (index !== activeIndex && index >= 0 && index < reviews.length) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true);
        const data = await fetchAllReviews();
        if (data.success) {
          // Shuffle all reviews from database
          const shuffled = [...data.reviews].sort(() => 0.5 - Math.random());
          setReviews(shuffled);
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTestimonials();
  }, []);

  if (loading || reviews.length === 0) return null;

  // Desktop shows only 3, Mobile shows all unique reviews from DB
  const displayReviews = isMobile ? reviews : reviews.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-[#fdfaf5] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-16 md:mb-20">
          <div className="flex items-center gap-2 bg-[#e7f3e8] text-[#1b8e4e] px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest mb-4 border border-[#1b8e4e]/10">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
            Customer Reviews
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1a3d0c] font-bakbak mb-4">
            What Our <span className="text-[#1b8e4e]">Customers</span> Say
          </h2>
          <div className="flex items-center gap-4 w-full max-w-[200px]">
            <div className="h-[1px] bg-[#1a3d0c]/20 flex-1"></div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1b8e4e">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
            </svg>
            <div className="h-[1px] bg-[#1a3d0c]/20 flex-1"></div>
          </div>
        </div>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-x-12 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory hide-scrollbar pb-12 md:pb-0 px-[10%] md:px-0"
          onScroll={handleScroll}
        >
          {displayReviews.map((rev, idx) => (
            <div 
              key={`${rev._id}-${idx}`} 
              className={`relative flex flex-col snap-center flex-shrink-0 transition-all duration-500 ease-in-out ${
                isMobile 
                  ? `min-w-[80vw] min-h-[380px] pt-10 ${activeIndex === idx ? 'scale-100 opacity-100' : 'scale-85 opacity-30 blur-[1px]'}` 
                  : 'min-w-0 min-h-[420px] pt-12 scale-100 opacity-100'
              }`}
            >
              
              {/* Avatar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-xl transition-transform duration-500 ${isMobile && activeIndex === idx ? 'scale-110' : 'scale-100'}`}>
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.name || 'user'}&mouth=smile,twinkle&eyes=default,happy&eyebrows=default,defaultNatural`}
                    alt={rev.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="relative group bg-gradient-to-br from-[#1b8e4e] to-[#125a32] rounded-[40px] p-6 md:p-10 pt-12 text-white shadow-2xl flex flex-col items-center text-center h-full w-full overflow-hidden">
                
                {/* Subtle Leaf Decoration */}
                <div className="absolute -bottom-4 -right-4 text-[70px] opacity-[0.08] grayscale pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                  🌿
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-2 md:mb-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} className={`text-[12px] md:text-[16px] ${n <= rev.rating ? 'text-[#f59e0b]' : 'text-white/20'}`}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Name */}
                <h4 className="text-[15px] md:text-[18px] font-black uppercase tracking-wider text-white mb-3 md:mb-6">
                  {rev.name}
                </h4>

                {/* Quotes and Content */}
                <div className="flex flex-col items-center flex-1 justify-between w-full overflow-hidden">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-40 mb-2 md:mb-4 rotate-180 shrink-0">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.437.917-4 3.638-4 5.849h3.983v10h-9.979z" />
                  </svg>
                  
                  <p 
                    className={`leading-[1.5] md:leading-[1.7] font-medium opacity-90 italic px-2 md:px-4 break-all ${
                      isMobile ? 'text-[15px] max-w-[220px]' : 'text-[18px] max-w-[320px]'
                    }`} 
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {rev.comment}
                  </p>

                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-40 mt-2 md:mt-4 shrink-0">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.437.917-4 3.638-4 5.849h3.983v10h-9.979z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex md:hidden justify-center gap-3 mt-10">

          {displayReviews.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-10 bg-[#1b8e4e]' : 'w-2.5 bg-[#1b8e4e]/20'
                }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { Button } from "../ui/button.jsx";

export function HeroSection() {
  return (
    <section className="relative h-[100vh] min-h-[500px] overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/dwbvs0uy9/image/upload/v1776465864/hero/hero_farmer_optimized.jpg"
          alt="Farmer in wheat field"
          className="w-full h-full object-cover object-[80%_20%] md:object-[center_20%]"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
      </div>

      {/* Centered Content */}
      <div className="relative max-w-[1600px] mx-auto px-6 h-full flex items-center justify-center text-center">

        <div className="max-w-xl">

          {/* Tagline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4 leading-tight font-jaini-purva">
            <span className="text-white/80">“</span>
            शुद्धम् सत्यम् सनातनम्
            <span className="text-white/80">”</span>
          </h1>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
            Abhivriddhi Organics, rooted in Satna, crafts pure, chemical-free flours
            inspired by India’s timeless food wisdom.
          </p>

          {/* Button */}
          <Link to="/products">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-md shadow-md transition">
              Shop now
            </Button>
          </Link>

        </div>
      </div>
    </section>
  )
}
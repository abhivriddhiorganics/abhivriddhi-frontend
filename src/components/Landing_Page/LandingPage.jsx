import { HeroSection } from "./hero-section.jsx"
import { FeaturesSection } from "./features-section.jsx"
import { PillarsSection } from "./pillars-section.jsx"
import { ProductsSection } from "./products-section.jsx"
import TestimonialSection from "./TestimonialSection.jsx"
import SEO from "../SEO"

export function LandingPage() {
  return (
    <>
      <SEO 
        title="Home"
        description="Shop pure, healthy, and sustainably sourced organic products at Abhivriddhi Organics. From handcrafted stone-ground atta to raw forest honey."
        keywords="Organic Flour, Handcrafted Groceries, Healthy Millets, Traditional Wellness, Pure Organic Honey"
        canonical="https://abhivriddhiorganics.com/"
      />
      <HeroSection />
      <FeaturesSection />
      <ProductsSection />
      <PillarsSection />
      <TestimonialSection />
    </>
  )
}

export default LandingPage


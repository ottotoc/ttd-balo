import React from 'react'
import IconsSprite from '../components/layout/IconsSprite.jsx'
import OffcanvasCart from '../components/layout/OffcanvasCart.jsx'
import OffcanvasSearch from '../components/layout/OffcanvasSearch.jsx'
import Header from '../components/layout/Header.jsx'
import Footer from '../components/layout/Footer.jsx'
import HeroBanner from '../components/sections/HeroBanner.jsx'
import CategoryCarousel from '../components/sections/CategoryCarousel.jsx'
import BrandCarousel from '../components/sections/BrandCarousel.jsx'
import TwoBannerAds from '../components/sections/TwoBannerAds.jsx'
import BestSelling from '../components/sections/BestSelling.jsx'
import SocialProofSection from '../components/sections/SocialProofSection.jsx'
import DiscountForm from '../components/sections/DiscountForm.jsx'
import MostPopular from '../components/sections/MostPopular.jsx'
import JustArrived from '../components/sections/JustArrived.jsx'
import TestimonialsSection from '../components/sections/TestimonialsSection.jsx'
import BlogSection from '../components/sections/BlogSection.jsx'
import AppPromo from '../components/sections/AppPromo.jsx'
import TikTokSection from '../components/sections/TikTokSection.jsx'
import FAQSection from '../components/sections/FAQSection.jsx'
import Benefits from '../components/sections/Benefits.jsx'
import ScrollToTop from '../components/ui/ScrollToTop.jsx'

export default function HomePage() {
  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />
      <HeroBanner />
      <CategoryCarousel />
      <BrandCarousel />
      <TwoBannerAds />
      <BestSelling />
      <SocialProofSection />
      <DiscountForm />
      <MostPopular />
      <JustArrived />
      <TestimonialsSection />
      <BlogSection />
      <AppPromo />
      <TikTokSection />
      <FAQSection />
      <Benefits />
      <Footer />
      <ScrollToTop />
    </>
  )
}


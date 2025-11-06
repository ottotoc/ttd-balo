import React from 'react'
import IconsSprite from './components/layout/IconsSprite.jsx'
import OffcanvasCart from './components/layout/OffcanvasCart.jsx'
import OffcanvasSearch from './components/layout/OffcanvasSearch.jsx'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import HeroBanner from './components/sections/HeroBanner.jsx'
import CategoryCarousel from './components/sections/CategoryCarousel.jsx'
import BrandCarousel from './components/sections/BrandCarousel.jsx'
import BestSelling from './components/sections/BestSelling.jsx'
import DiscountForm from './components/sections/DiscountForm.jsx'
import MostPopular from './components/sections/MostPopular.jsx'
import JustArrived from './components/sections/JustArrived.jsx'
import BlogSection from './components/sections/BlogSection.jsx'
import AppPromo from './components/sections/AppPromo.jsx'
import PeopleAlso from './components/sections/PeopleAlso.jsx'
import Benefits from './components/sections/Benefits.jsx'

export default function App() {
  return (
    <>
      <IconsSprite />
      <OffcanvasCart />
      <OffcanvasSearch />
      <Header />
      <HeroBanner />
      <CategoryCarousel />
      <BrandCarousel />
      {/* TrendingTabs removed - using BestSelling instead */}
      <BestSelling />
      <DiscountForm />
      <MostPopular />
      <JustArrived />
      <BlogSection />
      <AppPromo />
      <PeopleAlso />
      <Benefits />
      <Footer />
    </>
  )
}



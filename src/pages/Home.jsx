import React from 'react'
import HeroSection from '../components/HeroSection.jsx'
import MarqueeTicker from '../components/MarqueeTicker.jsx'
import BottomTicker from '../components/Bottomticker.jsx'
import AnnouncementSection from '../components/AnnouncementSection.jsx'
import ShopSection from '../components/ShopSection.jsx'
import OctaneSection from '../components/OctaneSection.jsx'
import SpecsSection from '../components/SpecsSection.jsx'
import AboutSection from '../components/AboutSection.jsx'
import OrderSection from '../components/OrderSection.jsx'
import FeaturesSection from '../components/Featuresection.jsx'  
import AboutSection2 from '../components/AboutSection2.jsx'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeTicker />
      <AnnouncementSection />
      <BottomTicker />
      <ShopSection />
      <FeaturesSection />
      <OctaneSection />
      <SpecsSection />
      <AboutSection />
      <AboutSection2 />
      <OrderSection />
    </main>
  )
}

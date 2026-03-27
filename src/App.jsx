import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ShopCategoryPage from './pages/ShopCategoryPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Route 1: Home — augiA20Il */}
        <Route path="/" element={<Home />} />
        {/* Route 2: Shop categories — /shop/categories/:id */}
        <Route path="/shop/categories/:nrKGcDENu" element={<ShopCategoryPage />} />
        {/* Route 3: Product detail — /shop/:id */}
        <Route path="/shop/:SKMt4bmTG" element={<ProductDetailPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

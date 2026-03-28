import React, { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('gaspass_cart')
    if (saved) {
      try {
        setCart(JSON.parse(saved))
      } catch (err) {
        console.error('Error loading cart:', err)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gaspass_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, weight, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(
        item => item.productId === product.id && item.weight === weight
      )

      if (existing) {
        return prevCart.map(item =>
          item.productId === product.id && item.weight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          weight,
          quantity,
          pricePerUnit: product.prices[weight],
          image: product.image
        }
      ]
    })
  }

  const removeFromCart = (productId, weight) => {
    setCart(prevCart =>
      prevCart.filter(
        item => !(item.productId === productId && item.weight === weight)
      )
    )
  }

  const updateQuantity = (productId, weight, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.weight === weight
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useCart = () => {
  const [cart, setCart] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart(null)
      setCartItems([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      // Obtener o crear carrito
      let { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (cartError && cartError.code === 'PGRST116') {
        // El carrito no existe, crear uno nuevo
        const { data: newCart, error: createError } = await supabase
          .from('carts')
          .insert([{ user_id: user.id }])
          .select()
          .single()

        if (createError) throw createError
        cartData = newCart
      } else if (cartError) {
        throw cartError
      }

      setCart(cartData)

      // Obtener items del carrito con información del producto
      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            image_url,
            stock
          )
        `)
        .eq('cart_id', cartData.id)

      if (itemsError) throw itemsError
      setCartItems(items || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito')
      return { error: 'No authenticated' }
    }

    try {
      // Verificar si el producto ya está en el carrito
      const existingItem = cartItems.find(
        item => item.product_id === productId
      )

      if (existingItem) {
        // Actualizar cantidad
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)

        if (error) throw error
      } else {
        // Agregar nuevo item
        const { error } = await supabase
          .from('cart_items')
          .insert([{
            cart_id: cart.id,
            product_id: productId,
            quantity: quantity
          }])

        if (error) throw error
      }

      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { error: error.message }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId)
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId)

      if (error) throw error
      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { error: error.message }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { error: error.message }
    }
  }

  const clearCart = async () => {
    if (!cart) return { success: true }
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      if (error) throw error
      await fetchCart()
      return { success: true }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { error: error.message }
    }
  }

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.products.price * item.quantity)
    }, 0)
  }

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cart,
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    getItemCount,
    refreshCart: fetchCart
  }
}
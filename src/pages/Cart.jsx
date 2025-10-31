import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'
import CartItem from '../components/cart/CartItem'
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import styles from './Cart.module.css'

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, clearCart, getTotal, getItemCount } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      await clearCart()
    }
  }

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
        <p>Cargando carrito...</p>
      </div>
    )
  }

  return (
    <div className={styles.cartPage}>
      <div className="container">
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            <ArrowLeft size={20} />
            Volver
          </button>
          <div className={styles.headerTitle}>
            <ShoppingCart size={32} />
            <h1>Mi Carrito</h1>
            {cartItems.length > 0 && (
              <span className={styles.itemCount}>
                {getItemCount()} {getItemCount() === 1 ? 'producto' : 'productos'}
              </span>
            )}
          </div>
          {cartItems.length > 0 && (
            <button onClick={handleClearCart} className={styles.clearBtn}>
              <Trash2 size={18} />
              Vaciar carrito
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <ShoppingCart size={80} className={styles.emptyIcon} />
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos para comenzar tu compra</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            <div className={styles.cartSummary}>
              <h2>Resumen del pedido</h2>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
              >
                Proceder al pago
              </button>

              <button 
                onClick={() => navigate('/products')}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
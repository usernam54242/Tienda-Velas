import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './ProductCard.module.css'

const ProductCard = ({ product }) => {
  const { id, name, price, image_url, stock } = product
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!user) {
      alert('Debes iniciar sesión para agregar productos al carrito')
      navigate('/login')
      return
    }

    const result = await addToCart(id, 1)
    if (result.success) {
      alert(`${name} agregado al carrito ✅`)
    } else {
      alert('Error al agregar al carrito')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={image_url || 'https://via.placeholder.com/300x300?text=Vela'} 
          alt={name}
          className={styles.image}
        />
        {stock === 0 && (
          <div className={styles.outOfStock}>Agotado</div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>

        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="#FCD34D" color="#FCD34D" />
          ))}
          <span className={styles.ratingText}>(5.0)</span>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>${price}</span>
          
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={styles.addButton}
          >
            <ShoppingCart size={18} />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
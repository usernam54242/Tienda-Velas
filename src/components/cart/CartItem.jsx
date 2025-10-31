import { Minus, Plus, Trash2 } from 'lucide-react'
import styles from './CartItem.module.css'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { products, quantity } = item
  const subtotal = products.price * quantity

  return (
    <div className={styles.cartItem}>
      <img 
        src={products.image_url || 'https://via.placeholder.com/100'} 
        alt={products.name}
        className={styles.image}
      />
      
      <div className={styles.info}>
        <h3 className={styles.name}>{products.name}</h3>
        <p className={styles.price}>${products.price.toFixed(2)}</p>
      </div>

      <div className={styles.quantity}>
        <button 
          onClick={() => onUpdateQuantity(item.id, quantity - 1)}
          className={styles.quantityBtn}
          disabled={quantity <= 1}
        >
          <Minus size={16} />
        </button>
        <span className={styles.quantityValue}>{quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(item.id, quantity + 1)}
          className={styles.quantityBtn}
          disabled={quantity >= products.stock}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className={styles.subtotal}>
        <p className={styles.subtotalLabel}>Subtotal</p>
        <p className={styles.subtotalValue}>${subtotal.toFixed(2)}</p>
      </div>

      <button 
        onClick={() => onRemove(item.id)}
        className={styles.removeBtn}
        title="Eliminar"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}

export default CartItem
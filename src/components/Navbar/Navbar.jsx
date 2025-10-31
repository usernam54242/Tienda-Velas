import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../hooks/useCart'
import { ShoppingCart, User, LogOut, Flame } from 'lucide-react'
import styles from './Navbar.module.css'

const Navbar = () => {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { cartItems, loading: cartLoading } = useCart()

  const handleLogout = async () => {
    await signOut()
  }

  // Calcular el total de items
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  console.log('🛒 Cart Items:', cartItems)
  console.log('🔢 Cart Count:', cartCount)

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContent}>
          <Link to="/" className={styles.logo}>
            <Flame size={28} />
            <span>Velas Creativas</span>
          </Link>

          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Inicio</Link>
            <Link to="/products" className={styles.navLink}>Productos</Link>
            
            {user && (
              <>
                <Link to="/cart" className={styles.navLink}>
                  <div className={styles.cartWrapper}>
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className={styles.badge}>{cartCount}</span>
                    )}
                  </div>
                  <span>Carrito</span>
                </Link>
                <Link to="/orders" className={styles.navLink}>Mis Pedidos</Link>
              </>
            )}

            {isAdmin() && (
              <Link to="/admin" className={styles.navLinkAdmin}>
                Admin
              </Link>
            )}
          </div>

          <div className={styles.userActions}>
            {user ? (
              <>
                <Link to="/profile" className={styles.userButton}>
                  <User size={20} />
                  <span>{profile?.full_name || 'Perfil'}</span>
                </Link>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.loginButton}>
                  Iniciar Sesión
                </Link>
                <Link to="/register" className={styles.registerButton}>
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
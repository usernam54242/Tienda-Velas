import { Link } from 'react-router-dom'
import { Flame, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          {/* Columna 1: Acerca de */}
          <div className={styles.footerColumn}>
            <div className={styles.logo}>
              <Flame size={32} />
              <h3>Velas Swan</h3>
            </div>
            <p className={styles.description}>
              Iluminamos tus momentos especiales con velas artesanales únicas, 
              hechas con amor y dedicación desde 2025.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div className={styles.footerColumn}>
            <h4>Enlaces Rápidos</h4>
            <ul className={styles.linkList}>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/cart">Carrito</Link></li>
              <li><Link to="/orders">Mis Pedidos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className={styles.footerColumn}>
            <h4>Contacto</h4>
            <ul className={styles.contactList}>
              <li>
                <MapPin size={18} />
                <span>Ciudad de México, México</span>
              </li>
              <li>
                <Phone size={18} />
                <span>(55) 1234-5678</span>
              </li>
              <li>
                <Mail size={18} />
                <span>contacto@velascreativas.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Velas Swan. Todos los derechos reservados.</p>
          <p className={styles.madeWith}>
            Hecho con <span className={styles.heart}>❤️</span> para el proyecto final de 2do dept
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
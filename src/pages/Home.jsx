import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard/ProductCard'
import { Flame, ArrowRight } from 'lucide-react'
import styles from './Home.module.css'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      console.log('🔍 Iniciando consulta a Supabase...')
      console.log('📍 URL de Supabase:', supabase.supabaseUrl)
      
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(4)

      console.log('📦 Respuesta de Supabase:', { data, error })

      if (error) {
        console.error('❌ Error de Supabase:', error)
        throw error
      }
      
      console.log('✅ Productos obtenidos:', data)
      setProducts(data || [])
    } catch (error) {
      console.error('💥 Error completo:', error)
      setError(`Error: ${error.message || 'No se pudo conectar con la base de datos'}`)
    } finally {
      setLoading(false)
      console.log('🏁 Carga finalizada')
    }
  }

  const handleAddToCart = (product) => {
    alert(`Producto agregado: ${product.name}`)
  }

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="alert alert-error">
          <h3>Error al cargar</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
            Verifica que hayas configurado correctamente las credenciales de Supabase en src/lib/supabase.js
          </p>
        </div>
        <button onClick={fetchFeaturedProducts} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <Flame size={64} className={styles.heroIcon} />
            <h1 className={styles.heroTitle}>Velas Creativas</h1>
            <p className={styles.heroSubtitle}>
              Ilumina tus momentos con nuestras velas artesanales únicas
            </p>
            <Link to="/products" className={styles.heroButton}>
              Ver Catálogo
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Productos Destacados</h2>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No hay productos disponibles</h3>
              <p>Verifica que hayas ejecutado el script SQL en Supabase para insertar productos</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
  <ProductCard 
    key={product.id} 
    product={product}
  />
))}
            </div>
          )}
          
          <div className={styles.viewAll}>
            <Link to="/products" className="btn btn-primary">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
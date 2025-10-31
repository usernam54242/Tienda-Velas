import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard/ProductCard'
import { Search, Filter } from 'lucide-react'
import styles from './Products.module.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch products
      await fetchProducts()
      
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar productos')
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchProducts()
    }
  }, [selectedCategory])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          {error}
        </div>
        <button onClick={fetchData} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className={styles.productsPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>Nuestros Productos</h1>
          <p>Descubre nuestra colección de velas artesanales</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.categoryFilter}>
            <Filter size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="all">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3>No se encontraron productos</h3>
            <p>Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
  <ProductCard
    key={product.id}
    product={product}
  />
))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Products
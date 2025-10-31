import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import styles from './ProductsAdmin.module.css'

const ProductsAdmin = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    is_active: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      console.log('🔄 Recargando datos...')
      
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select('*, categories(name)')
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
      ])

      if (productsRes.error) {
        console.error('❌ Error productos:', productsRes.error)
        throw productsRes.error
      }
      
      if (categoriesRes.error) {
        console.error('❌ Error categorías:', categoriesRes.error)
        throw categoriesRes.error
      }

      console.log('✅ Datos cargados correctamente')
      setProducts(productsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('💥 Error al cargar:', error)
      alert(`Error al cargar datos: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🚀 Formulario enviado')
    
    // Validaciones
    if (!formData.name.trim()) {
      alert('⚠️ El nombre es requerido')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('⚠️ El precio debe ser mayor a 0')
      return
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('⚠️ El stock no puede ser negativo')
      return
    }

    setSubmitting(true)
    
    try {
      // Preparar datos
      const dataToSave = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id || null,
        image_url: formData.image_url.trim() || null,
        is_active: formData.is_active
      }

      console.log('💾 Datos a guardar:', dataToSave)

      let result;

      if (editingProduct) {
        // Actualizar producto existente
        console.log('✏️ Actualizando producto ID:', editingProduct.id)
        
        result = await supabase
          .from('products')
          .update(dataToSave)
          .eq('id', editingProduct.id)
          .select()

        console.log('📦 Resultado actualizar:', result)
      } else {
        // Crear nuevo producto
        console.log('➕ Creando nuevo producto')
        
        result = await supabase
          .from('products')
          .insert([dataToSave])
          .select()

        console.log('📦 Resultado crear:', result)
      }

      // Verificar errores
      if (result.error) {
        console.error('❌ Error de Supabase:', result.error)
        throw result.error
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('No se recibió respuesta del servidor')
      }

      // Éxito
      console.log('✅ Operación exitosa')
      
      // IMPORTANTE: Primero resetear el formulario
      const wasEditing = editingProduct !== null
      resetForm()
      
      // Luego mostrar mensaje
      alert(wasEditing ? '✅ Producto actualizado correctamente' : '✅ Producto creado correctamente')
      
      // Finalmente recargar datos
      console.log('🔄 Recargando lista de productos...')
      await fetchData()
      console.log('✅ Lista actualizada')

    } catch (error) {
      console.error('💥 Error completo:', error)
      
      let errorMessage = 'Error desconocido'
      
      if (error.message) {
        errorMessage = error.message
      }
      
      if (error.code === '42501') {
        errorMessage = 'No tienes permisos de administrador. Verifica tu rol en la base de datos.'
      }
      
      alert(`❌ Error: ${errorMessage}`)
    } finally {
      console.log('🏁 Finalizando submit')
      setSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    console.log('✏️ Editando producto:', product)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || '',
      image_url: product.image_url || '',
      is_active: product.is_active
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${name}"?`)) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('✅ Producto eliminado')
      await fetchData()
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const toggleActive = async (product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id)

      if (error) throw error
      await fetchData()
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category_id: '',
      image_url: '',
      is_active: true
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className={styles.adminPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>Gestión de Productos</h1>
          <button 
            onClick={() => {
              if (showForm) {
                resetForm()
              } else {
                setShowForm(true)
              }
            }}
            className="btn btn-primary"
          >
            <Plus size={20} />
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
          </button>
        </div>

        {showForm && (
          <div className={styles.formContainer}>
            <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Vela Lavanda"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción del producto..."
                  rows="3"
                  disabled={submitting}
                />
              </div>

              <div className={styles.formRow}>
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="input"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="299.00"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    placeholder="50"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select
                  className="input"
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  disabled={submitting}
                >
                  <option value="">Sin categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">URL de Imagen</label>
                <input
                  type="url"
                  className="input"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={submitting}
                />
                {formData.image_url && (
                  <img 
                    src={formData.image_url} 
                    alt="Preview" 
                    style={{ marginTop: '0.5rem', maxWidth: '200px', borderRadius: '0.5rem' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    disabled={submitting}
                  />
                  <span>Producto activo</span>
                </label>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.productsTable}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <p>No hay productos. Crea el primero.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/50'} 
                        alt={product.name}
                        className={styles.productImage}
                      />
                    </td>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.categories?.name || 'Sin categoría'}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                      <span className={product.is_active ? styles.active : styles.inactive}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button 
                          onClick={() => toggleActive(product)}
                          className={styles.actionBtn}
                          title={product.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {product.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button 
                          onClick={() => handleEdit(product)}
                          className={styles.actionBtn}
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className={styles.actionBtnDanger}
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsAdmin
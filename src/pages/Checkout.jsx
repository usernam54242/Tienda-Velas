import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react'
import styles from './Checkout.module.css'

const Checkout = () => {
  const { cartItems, getTotal, clearCart, loading: cartLoading } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orderLoading, setOrderLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [error, setError] = useState(null)
  
  const [newAddress, setNewAddress] = useState({
    address_line: '',
    city: '',
    state: '',
    postal_code: ''
  })

  useEffect(() => {
    console.log('🔍 Checkout - Verificando usuario y carrito...')
    console.log('Usuario:', user)
    console.log('Items en carrito:', cartItems.length)
    
    if (!user) {
      console.log('❌ No hay usuario, redirigiendo a login')
      navigate('/login')
      return
    }
    
    if (cartLoading) {
      console.log('⏳ Carrito aún cargando...')
      return
    }
    
    if (cartItems.length === 0) {
      console.log('❌ Carrito vacío, redirigiendo')
      navigate('/cart')
      return
    }
    
    console.log('✅ Todo correcto, cargando direcciones')
    fetchAddresses()
  }, [user, cartItems, cartLoading])

  const fetchAddresses = async () => {
    try {
      console.log('📍 Obteniendo direcciones...')
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      console.log('📦 Respuesta de direcciones:', { data, error })

      if (error) throw error
      
      setAddresses(data || [])
      console.log(`✅ ${data?.length || 0} direcciones encontradas`)
      
      const defaultAddr = data?.find(addr => addr.is_default)
      if (defaultAddr) {
        setSelectedAddress(defaultAddr.id)
        console.log('✅ Dirección predeterminada seleccionada')
      }
    } catch (error) {
      console.error('❌ Error obteniendo direcciones:', error)
      setError(`Error al cargar direcciones: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()
    console.log('➕ Agregando nueva dirección...')
    
    try {
      const addressData = {
        user_id: user.id,
        ...newAddress,
        is_default: addresses.length === 0
      }
      
      console.log('📤 Datos a insertar:', addressData)
      
      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert([addressData])
        .select()

      console.log('📦 Respuesta inserción:', { data, error })

      if (error) throw error
      
      setNewAddress({ address_line: '', city: '', state: '', postal_code: '' })
      setShowAddressForm(false)
      await fetchAddresses()
      alert('✅ Dirección agregada correctamente')
    } catch (error) {
      console.error('❌ Error agregando dirección:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('⚠️ Por favor selecciona una dirección de envío')
      return
    }

    console.log('🛒 Creando pedido...')
    setOrderLoading(true)
    
    try {
      // Crear orden
      console.log('1️⃣ Insertando orden...')
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: user.id,
          total: getTotal(),
          status: 'pending',
          shipping_address_id: selectedAddress
        }])
        .select()
        .single()

      console.log('📦 Orden creada:', { order, orderError })
      if (orderError) throw orderError

      // Crear items de la orden
      console.log('2️⃣ Insertando items de la orden...')
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.products.name,
        quantity: item.quantity,
        price: item.products.price
      }))

      console.log('📦 Items a insertar:', orderItems)

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      console.log('Items insertados:', { error: itemsError })
      if (itemsError) throw itemsError

      // Actualizar stock de productos
      console.log('3️⃣ Actualizando stock...')
      for (const item of cartItems) {
        const newStock = item.products.stock - item.quantity
        console.log(`Producto ${item.products.name}: ${item.products.stock} -> ${newStock}`)
        
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id)

        if (stockError) {
          console.error('Error actualizando stock:', stockError)
          throw stockError
        }
      }

      // Limpiar carrito
      console.log('4️⃣ Limpiando carrito...')
      await clearCart()
      
      console.log('✅ ¡Pedido completado exitosamente!')
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/orders')
      }, 3000)
    } catch (error) {
      console.error('💥 Error al procesar pedido:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setOrderLoading(false)
    }
  }

  // Mostrar loading mientras se verifica todo
  if (cartLoading || loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
        <p>Preparando checkout...</p>
      </div>
    )
  }

  // Mostrar error si hay
  if (error) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="alert alert-error">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
        <button onClick={fetchAddresses} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <CheckCircle size={80} color="#10B981" />
          <h1>¡Pedido realizado con éxito!</h1>
          <p>Tu pedido ha sido procesado correctamente</p>
          <p className={styles.redirectText}>Redirigiendo a tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <h1 className={styles.title}>
          <CreditCard size={32} />
          Finalizar Compra
        </h1>

        <div className={styles.checkoutContent}>
          {/* Direcciones de envío */}
          <div className={styles.section}>
            <h2>
              <MapPin size={24} />
              Dirección de Envío
            </h2>

            {addresses.length === 0 ? (
              <div className={styles.noAddresses}>
                <p>No tienes direcciones guardadas</p>
                <button 
                  onClick={() => setShowAddressForm(true)}
                  className="btn btn-primary"
                >
                  Agregar dirección
                </button>
              </div>
            ) : (
              <div className={styles.addresses}>
                {addresses.map(addr => (
                  <label key={addr.id} className={styles.addressCard}>
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                    <div className={styles.addressInfo}>
                      <p className={styles.addressLine}>{addr.address_line}</p>
                      <p className={styles.addressDetails}>
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                      {addr.is_default && (
                        <span className={styles.defaultBadge}>Predeterminada</span>
                      )}
                    </div>
                  </label>
                ))}
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className={styles.addAddressBtn}
                >
                  + Agregar nueva dirección
                </button>
              </div>
            )}

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className={styles.addressForm}>
                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="input"
                    value={newAddress.address_line}
                    onChange={(e) => setNewAddress({...newAddress, address_line: e.target.value})}
                    placeholder="Calle, número, colonia"
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="input"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <input
                      type="text"
                      className="input"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Código Postal</label>
                  <input
                    type="text"
                    className="input"
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({...newAddress, postal_code: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" className="btn btn-primary">
                    Guardar dirección
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Resumen del pedido */}
          <div className={styles.orderSummary}>
            <h2>
              <Package size={24} />
              Resumen del Pedido
            </h2>

            <div className={styles.summaryItems}>
              {cartItems.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <img src={item.products.image_url} alt={item.products.name} />
                  <div className={styles.summaryItemInfo}>
                    <p className={styles.summaryItemName}>{item.products.name}</p>
                    <p className={styles.summaryItemQty}>Cantidad: {item.quantity}</p>
                  </div>
                  <p className={styles.summaryItemPrice}>
                    ${(item.products.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider}></div>

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
              onClick={handlePlaceOrder}
              disabled={orderLoading || !selectedAddress}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {orderLoading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
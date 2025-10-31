import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import styles from './Orders.module.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          ),
          shipping_addresses (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={20} />
      case 'confirmed': return <CheckCircle size={20} />
      case 'shipped': return <Truck size={20} />
      case 'delivered': return <CheckCircle size={20} />
      case 'cancelled': return <XCircle size={20} />
      default: return <Package size={20} />
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      shipped: 'En camino',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    }
    return statusMap[status] || status
  }

  const getStatusClass = (status) => {
    return styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]
  }

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    )
  }

  return (
    <div className={styles.ordersPage}>
      <div className="container">
        <h1 className={styles.title}>
          <Package size={32} />
          Mis Pedidos
        </h1>

        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <Package size={80} className={styles.emptyIcon} />
            <h2>No tienes pedidos aún</h2>
            <p>Realiza tu primera compra</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Ver Productos
            </button>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <p className={styles.orderId}>Pedido #{order.id.slice(0, 8)}</p>
                    <p className={styles.orderDate}>
                      {new Date(order.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusText(order.status)}
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.order_items.map(item => (
                    <div key={item.id} className={styles.orderItem}>
                      <img 
                        src={item.products?.image_url || 'https://via.placeholder.com/60'} 
                        alt={item.product_name}
                      />
                      <div className={styles.orderItemInfo}>
                        <p className={styles.orderItemName}>{item.product_name}</p>
                        <p className={styles.orderItemQty}>Cantidad: {item.quantity}</p>
                      </div>
                      <p className={styles.orderItemPrice}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {order.shipping_addresses && (
                  <div className={styles.orderAddress}>
                    <strong>Dirección de envío:</strong>
                    <p>{order.shipping_addresses.address_line}</p>
                    <p>{order.shipping_addresses.city}, {order.shipping_addresses.state}</p>
                  </div>
                )}

                <div className={styles.orderFooter}>
                  <p className={styles.orderTotal}>
                    Total: <strong>${order.total.toFixed(2)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
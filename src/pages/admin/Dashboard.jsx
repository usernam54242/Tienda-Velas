import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from 'lucide-react'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Total productos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Total órdenes
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('*, order_items(*)', { count: 'exact' })

      // Calcular ingresos totales
      const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total), 0) || 0

      // Órdenes pendientes
      const { count: pendingCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Órdenes recientes
      const { data: recent } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: totalRevenue,
        pendingOrders: pendingCount || 0
      })

      setRecentOrders(recent || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <h1 className={styles.title}>Panel de Administración</h1>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#DBEAFE' }}>
              <Package size={32} color="#1E40AF" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Productos</p>
              <p className={styles.statValue}>{stats.totalProducts}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#D1FAE5' }}>
              <ShoppingBag size={32} color="#065F46" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Total Pedidos</p>
              <p className={styles.statValue}>{stats.totalOrders}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#FEF3C7' }}>
              <DollarSign size={32} color="#92400E" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Ingresos Totales</p>
              <p className={styles.statValue}>${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#FEE2E2' }}>
              <TrendingUp size={32} color="#991B1B" />
            </div>
            <div className={styles.statInfo}>
              <p className={styles.statLabel}>Pedidos Pendientes</p>
              <p className={styles.statValue}>{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>Acciones Rápidas</h2>
          <div className={styles.actionsGrid}>
            <Link to="/admin/products" className={styles.actionCard}>
              <Package size={24} />
              <span>Gestionar Productos</span>
            </Link>
            <Link to="/admin/categories" className={styles.actionCard}>
              <ShoppingBag size={24} />
              <span>Gestionar Categorías</span>
            </Link>
            <Link to="/admin/orders" className={styles.actionCard}>
              <Users size={24} />
              <span>Ver Pedidos</span>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className={styles.recentOrders}>
          <h2>Pedidos Recientes</h2>
          {recentOrders.length === 0 ? (
            <p className={styles.emptyText}>No hay pedidos recientes</p>
          ) : (
            <div className={styles.ordersTable}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id.slice(0, 8)}</td>
                      <td>{order.profiles?.full_name || order.profiles?.email || 'N/A'}</td>
                      <td>${order.total.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
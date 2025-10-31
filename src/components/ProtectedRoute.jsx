import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-full">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && profile?.role !== 'admin') {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <div className="alert alert-error">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
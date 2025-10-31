import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Mail, Phone, MapPin, Save, Edit, Trash2 } from 'lucide-react'
import styles from './Profile.module.css'

const Profile = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: ''
  })

  const [newAddress, setNewAddress] = useState({
    address_line: '',
    city: '',
    state: '',
    postal_code: '',
    is_default: false
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      })
    }
    
    fetchAddresses()
  }, [user, profile])

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })

      if (error) throw error
      setAddresses(data || [])
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)

      if (error) throw error
      
      alert('✅ Perfil actualizado correctamente')
      setEditMode(false)
      window.location.reload() // Recargar para actualizar el contexto
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .insert([{
          user_id: user.id,
          ...newAddress
        }])

      if (error) throw error
      
      alert('✅ Dirección agregada')
      setNewAddress({
        address_line: '',
        city: '',
        state: '',
        postal_code: '',
        is_default: false
      })
      setShowAddressForm(false)
      fetchAddresses()
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return

    try {
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      alert('✅ Dirección eliminada')
      fetchAddresses()
    } catch (error) {
      console.error('Error:', error)
      alert(`Error: ${error.message}`)
    }
  }

  const handleSetDefault = async (id) => {
    try {
      // Quitar default de todas
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)

      // Poner default en la seleccionada
      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', id)

      if (error) throw error
      fetchAddresses()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className={styles.profilePage}>
      <div className="container">
        <h1 className={styles.title}>
          <User size={32} />
          Mi Perfil
        </h1>

        <div className={styles.profileContent}>
          {/* Información Personal */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Información Personal</h2>
              {!editMode && (
                <button 
                  onClick={() => setEditMode(true)}
                  className={styles.editBtn}
                >
                  <Edit size={18} />
                  Editar
                </button>
              )}
            </div>

            {editMode ? (
              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={18} />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={profile?.email || ''}
                    disabled
                    style={{ background: '#F3F4F6', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    El correo no se puede modificar
                  </small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone size={18} />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="input"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="(55) 1234-5678"
                  />
                </div>

                <div className={styles.formActions}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <Save size={18} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setEditMode(false)
                      setProfileData({
                        full_name: profile.full_name || '',
                        phone: profile.phone || ''
                      })
                    }}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <User size={20} color="var(--primary)" />
                  <div>
                    <p className={styles.infoLabel}>Nombre</p>
                    <p className={styles.infoValue}>{profile?.full_name || 'No definido'}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <Mail size={20} color="var(--primary)" />
                  <div>
                    <p className={styles.infoLabel}>Correo</p>
                    <p className={styles.infoValue}>{profile?.email}</p>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <Phone size={20} color="var(--primary)" />
                  <div>
                    <p className={styles.infoLabel}>Teléfono</p>
                    <p className={styles.infoValue}>{profile?.phone || 'No definido'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direcciones de Envío */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>
                <MapPin size={24} />
                Direcciones de Envío
              </h2>
              <button 
                onClick={() => setShowAddressForm(!showAddressForm)}
                className={styles.editBtn}
              >
                {showAddressForm ? 'Cancelar' : '+ Agregar'}
              </button>
            </div>

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

                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={newAddress.is_default}
                      onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                    />
                    <span>Establecer como predeterminada</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary">
                  Guardar Dirección
                </button>
              </form>
            )}

            <div className={styles.addressesList}>
              {addresses.length === 0 ? (
                <p className={styles.emptyText}>No tienes direcciones guardadas</p>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} className={styles.addressCard}>
                    <div className={styles.addressInfo}>
                      <p className={styles.addressLine}>{addr.address_line}</p>
                      <p className={styles.addressDetails}>
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </p>
                      {addr.is_default && (
                        <span className={styles.defaultBadge}>Predeterminada</span>
                      )}
                    </div>
                    <div className={styles.addressActions}>
                      {!addr.is_default && (
                        <button 
                          onClick={() => handleSetDefault(addr.id)}
                          className={styles.defaultBtn}
                        >
                          Predeterminar
                        </button>
                      )}
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        className={styles.deleteBtn}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
# 🕯 Velas Creativas - Tienda Online

Tienda de velas artesanales con sistema completo de e-commerce, gestión de inventario y panel de administración.

## 📋 Descripción

Proyecto de tienda online desarrollado con React y Supabase que permite a los usuarios navegar por un catálogo de velas, agregar productos al carrito, realizar pedidos y gestionar su perfil. Incluye un panel de administración completo para la gestión de productos e inventario.

## 🚀 Tecnologías Utilizadas

### Frontend
- *React 18* - Biblioteca de JavaScript para interfaces de usuario
- *Vite* - Build tool y servidor de desarrollo
- *React Router DOM v6* - Navegación y enrutamiento
- *CSS Modules* - Estilos componentizados y sin conflictos
- *Lucide React* - Iconos modernos

### Backend
- *Supabase* - Backend as a Service
  - PostgreSQL - Base de datos relacional
  - Authentication - Sistema de autenticación
  - Row Level Security (RLS) - Seguridad a nivel de filas
  - Políticas de acceso por roles

### Seguridad
- Row Level Security (RLS) habilitado en todas las tablas
- Políticas personalizadas por rol (user/admin)
- Autenticación JWT
- Validaciones del lado del cliente y servidor

## ✨ Funcionalidades

### 👤 Usuario General (Sin autenticación)
- ✅ Navegación por catálogo de productos
- ✅ Búsqueda y filtros por categoría
- ✅ Visualización de detalles de productos
- ✅ Registro de nuevos usuarios
- ✅ Inicio de sesión

### 🛒 Usuario Autenticado
- ✅ Carrito de compras persistente
- ✅ Agregar, actualizar y eliminar productos del carrito
- ✅ Gestión de direcciones de envío
- ✅ Proceso de checkout completo
- ✅ Confirmación de pedidos
- ✅ Historial de pedidos
- ✅ Edición de perfil personal
- ✅ Actualización automática de stock

### 👨‍💼 Panel de Administración
- ✅ Dashboard con estadísticas en tiempo real
  - Total de productos
  - Total de pedidos
  - Ingresos totales
  - Pedidos pendientes
- ✅ CRUD completo de productos
  - Crear productos
  - Editar productos existentes
  - Activar/desactivar productos
  - Control de stock
  - Gestión de imágenes
- ✅ Visualización de pedidos recientes
- ✅ Gestión de categorías

### 🎨 Diseño y UX
- ✅ Diseño responsive (mobile-first)
- ✅ Animaciones y transiciones suaves
- ✅ Estados de carga y error
- ✅ Mensajes de confirmación
- ✅ Footer profesional con información de contacto

## 📊 Base de Datos

### Esquema de Tablas

profiles
├── id (UUID, PK)
├── email (TEXT)
├── full_name (TEXT)
├── phone (TEXT)
├── role (TEXT) - 'user' o 'admin'
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

shipping_addresses
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── address_line (TEXT)
├── city (TEXT)
├── state (TEXT)
├── postal_code (TEXT)
├── is_default (BOOLEAN)
└── created_at (TIMESTAMP)

categories
├── id (UUID, PK)
├── name (TEXT)
├── description (TEXT)
├── is_active (BOOLEAN)
└── created_at (TIMESTAMP)

products
├── id (UUID, PK)
├── name (TEXT)
├── description (TEXT)
├── price (DECIMAL)
├── stock (INTEGER)
├── category_id (UUID, FK → categories)
├── image_url (TEXT)
├── is_active (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

carts
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

cart_items
├── id (UUID, PK)
├── cart_id (UUID, FK → carts)
├── product_id (UUID, FK → products)
├── quantity (INTEGER)
└── created_at (TIMESTAMP)

orders
├── id (UUID, PK)
├── user_id (UUID, FK → profiles)
├── total (DECIMAL)
├── status (TEXT) - 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
├── shipping_address_id (UUID, FK → shipping_addresses)
└── created_at (TIMESTAMP)

order_items
├── id (UUID, PK)
├── order_id (UUID, FK → orders)
├── product_id (UUID, FK → products)
├── product_name (TEXT)
├── quantity (INTEGER)
├── price (DECIMAL)
└── created_at (TIMESTAMP)


## 🔧 Instalación

### Prerequisitos
- Node.js 16+ 
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación

1. *Clonar el repositorio*
bash
git clone https://github.com/usernam54242/tienda-velas.git
cd tienda-velas


2. *Instalar dependencias*
bash
npm install


3. *Configurar Supabase*

Crear un proyecto en [Supabase](https://supabase.com)

Ejecutar el script SQL de creación de tablas (ver docs/database.sql)

4. *Configurar variables de entorno*

Editar src/lib/supabase.js con tus credenciales:
javascript
const supabaseUrl = 'https://exdricytzylemlozaack.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZHJpY3l0enlsZW1sb3phYWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3ODg0MjAsImV4cCI6MjA3NzM2NDQyMH0.CWN3xvvDLzoLBA3Yy4FL4qCsu9lKGRK5t9DtxvYZTP4'


5. *Ejecutar en modo desarrollo*
bash
npm run dev


La aplicación estará disponible en http://localhost:5173

6. *Construir para producción*
bash
npm run build


## 👤 Usuarios de Prueba

### Usuario Administrador

Email: enyamow@gmail.com.com
Password: 123456


### Usuario Regular

Email: ttetejk@gmail.com
Password: 123456


O registra un nuevo usuario desde la aplicación.

Para convertir un usuario en administrador, ejecuta en Supabase SQL Editor:
sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'enyamow@gmail.com';


## 📁 Estructura del Proyecto

tienda-velas/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.module.css
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   └── Footer.module.css
│   │   ├── ProductCard/
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProductCard.module.css
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartItem.module.css
│   │   └── ProtectedRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useCart.js
│   ├── lib/
│   │   └── supabase.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Products.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       └── ProductsAdmin.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── README.md


## 🔒 Seguridad Implementada

### Row Level Security (RLS)
Todas las tablas tienen RLS habilitado con políticas específicas:

- *profiles*: Los usuarios solo pueden ver y editar su propio perfil
- *carts/cart_items*: Cada usuario solo accede a su propio carrito
- *orders/order_items*: Los usuarios solo ven sus propios pedidos
- *products*: Público puede ver productos activos, admin puede gestionar todo
- *shipping_addresses*: Cada usuario gestiona solo sus direcciones

### Validaciones
- Validación de formularios en el cliente
- Validación de tipos de datos en la base de datos
- Constraints de integridad referencial
- Sanitización de entradas

## 🎯 Características Destacadas

### Mejoras Implementadas
1. *Footer Profesional*: Footer completo con información de contacto, enlaces rápidos y redes sociales
2. *Sistema de Roles*: Diferenciación clara entre usuarios regulares y administradores
3. *Gestión Inteligente de Stock*: Actualización automática de inventario al confirmar pedidos
4. *Protección de Datos*: No se pueden eliminar productos que ya fueron vendidos (solo desactivar)
5. *Diseño Responsive*: Totalmente funcional en dispositivos móviles y tablets

## 📝 Scripts Disponibles
bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Preview de la build
npm run preview

# Linter
npm run lint


## 🚧 Próximas Mejoras

- [ ] Sistema de reseñas y calificaciones
- [ ] Integración con pasarela de pago real (Stripe)
- [ ] Notificaciones por email
- [ ] Chat de soporte en vivo
- [ ] Wishlist de productos favoritos
- [ ] Cupones de descuento
- [ ] Sistema de puntos y recompensas

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
3. Commit tus cambios (git commit -m 'Add some AmazingFeature')
4. Push a la rama (git push origin feature/AmazingFeature)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto fue desarrollado como proyecto académico.

## 👨‍💻 Autor

*Tu Nombre*
- Email: tu@email.com
- GitHub: [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Profesor: [Leonardo Miguel Moreno Villalba]
- Institución: [Tecnológico de Estudios Superiores de Ecatepec]
- Supabase por el excelente backend
- Unsplash por las imágenes de productos

---

⭐ Si este proyecto te fue útil, no olvides darle una estrella

Desarrollado con ❤ para el proyecto final - 2025

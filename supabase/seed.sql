-- =========================================
-- SEED: Datos iniciales de categorías
-- =========================================
INSERT INTO categories (name, description) VALUES
('Aromáticas', 'Velas con fragancias naturales'),
('Decorativas', 'Velas con diseños únicos'),
('Temáticas', 'Velas para ocasiones especiales'),
('Artesanales', 'Velas hechas a mano')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- SEED: Productos iniciales
-- =========================================
INSERT INTO products (name, description, price, stock, category_id, image_url) VALUES
('Vela Lavanda', 'Vela aromática de lavanda natural', 299.00, 50,
 (SELECT id FROM categories WHERE name = 'Aromáticas'),
 'https://i.pinimg.com/1200x/d3/b3/6f/d3b36f73bbf31c6a6dc1708975e9d874.jpg'
),

('Vela Vainilla', 'Vela con aroma a vainilla', 249.00, 45,
 (SELECT id FROM categories WHERE name = 'Aromáticas'),
 'https://i.pinimg.com/736x/cd/ca/66/cdca660b1d971f6de8dd3ba38c663be7.jpg'
),

('Vela Geométrica', 'Vela decorativa con diseño moderno', 349.00, 30,
 (SELECT id FROM categories WHERE name = 'Decorativas'),
 'https://i.pinimg.com/1200x/34/c6/f8/34c6f81236b65f0f5637c9a0118c800a.jpg'
),

('Vela Mármol', 'Elegante vela con efecto mármol', 399.00, 25,
 (SELECT id FROM categories WHERE name = 'Decorativas'),
 'https://i.pinimg.com/1200x/2f/68/1c/2f681c902e16946be4af34f04d8877db.jpg'
);

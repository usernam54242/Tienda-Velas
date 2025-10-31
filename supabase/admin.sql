-- Reemplaza 'tu@email.com' con tu email real
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'enyamow@gmail.com';

-- Verificar que funcionó
SELECT email, role FROM profiles WHERE role = 'admin';


-- Ver tu rol actual
SELECT email, role FROM profiles WHERE email = 'enyamow@gmail.com';


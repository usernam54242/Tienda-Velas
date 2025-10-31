-- Verificar que RLS esté habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'shipping_addresses';

-- Crear/actualizar políticas para shipping_addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON shipping_addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON shipping_addresses;

CREATE POLICY "Users can view own addresses" ON shipping_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON shipping_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON shipping_addresses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON shipping_addresses
  FOR DELETE USING (auth.uid() = user_id);
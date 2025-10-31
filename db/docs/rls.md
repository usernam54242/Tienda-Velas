# Políticas RLS del Proyecto

## Tabla: profiles
- Solo el usuario puede ver y actualizar su propio perfil

```sql
alter table profiles enable row level security;

create policy "Users can select own profile"
  on profiles
  for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on profiles
  for update
  using (id = auth.uid());

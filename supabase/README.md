# Supabase del sitio

Esta carpeta contiene la estructura del panel editorial. Para activarla en el proyecto remoto:

1. Crear únicamente la cuenta privada de Enzo desde Authentication > Users.
2. Desactivar los registros públicos en Authentication > Providers > Email.
3. Ejecutar la migración de `supabase/migrations` desde el SQL Editor de Supabase o con la CLI enlazada.
4. Mantener cualquier contraseña, access token o service-role key fuera del repositorio.

El navegador sólo recibe la publishable key. Las políticas RLS limitan la escritura al autor autenticado y la lectura pública a escritos publicados.

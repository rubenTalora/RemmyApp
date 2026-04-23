UPDATE profiles
SET role = 'superadmin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'rubtalram@alu.edu.gva.es'
);
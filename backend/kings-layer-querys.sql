// CONSULTA PARA ADMINISTRADORES
SELECT u.name, u.last_name, u.email, u.phone, u.token, u.confirmed, r.role, a.access_level
FROM users as u
RIGHT JOIN roles as r ON u.role_id = r.id
LEFT JOIN admins as a ON u.id = a.user_id;

// CONSULTA PARA CLIENTES
SELECT u.id, u.name, u.last_name, u.email, u.phone, u.token, u.confirmed, r.name, m.matricula, m.gender, m.born_date
FROM users as u
RIGHT JOIN roles as r ON u.role_id = r.id
RIGHT JOIN members as m ON u.id = m.user_id;
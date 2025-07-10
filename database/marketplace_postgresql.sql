-- CREATE DATABASE marketplace;

-- Tablas PostgreSQL
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(100),
    picture VARCHAR(255)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(50),
    location VARCHAR(100),
    item_condition VARCHAR(50),
    price NUMERIC(10, 2),
    picture VARCHAR(255)
);
SELECT users.name, posts.title , posts.description from users inner join posts on users.id = posts.user_id;
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id)
);

CREATE TABLE interested (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(id),
    message TEXT
);

-- Datos de ejemplo.
-- Datos en users
INSERT INTO users (name, email, phone, password, picture) VALUES
('Elena Ruiz', 'elena@example.com', '123456789', 'password1', 'elena.jpg'),
('Carlos Soto', 'carlos@example.com', '987654321', 'password2', 'carlos.jpg'),
('Lucía Pérez', 'lucia@example.com', '1122334455', 'password3', 'lucia.jpg');

-- Datos en posts
INSERT INTO posts (user_id, title, description, category, location, item_condition, price, picture) VALUES
(1, 'Vestido floral', 'Vestido elegante para ocasiones especiales', 'Mujer', 'Santiago', 'Nuevo', 25000, 'vestido.jpg'),
(2, 'Camisa formal', 'Camisa blanca ideal para oficina', 'Hombre', 'Valparaíso', 'Usado', 15000, 'camisa.jpg'),
(3, 'Polerón infantil', 'Polerón colorido para niños', 'Niños o niñas', 'Concepción', 'Nuevo', 18000, 'poleron.jpg'),
(1, 'Cartera de cuero', 'Cartera elegante para mujer', 'Accesorios', 'Temuco', 'Nuevo', 30000, 'cartera.jpg'),
(3, 'Zapatos deportivos', 'Zapatos cómodos y resistentes', 'Todo', 'La Serena', 'Usado', 20000, 'zapatos.jpg'),
(2, 'Gorro de lana', 'Gorro tejido a mano', 'Accesorios', 'Osorno', 'Nuevo', 8000, 'gorro.jpg');

-- Datos en favorites
INSERT INTO favorites (user_id, post_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(3, 4);

-- Datos en interested
INSERT INTO interested (user_id, post_id, message) VALUES
(2, 1, 'Estoy interesado en el vestido floral, ¿sigue disponible?'),
(3, 2, '¿Puede enviarme más fotos de la camisa?'),
(1, 5, 'Me gustaría saber si los zapatos están disponibles en talla 40.'),
(2, 6, '¿Hace envíos a regiones?');



SELECT users.name, posts.title , posts.description from users inner join posts on users.id = posts.user_id;
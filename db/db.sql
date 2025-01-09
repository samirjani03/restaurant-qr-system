CREATE DATABASE restaurant_qr;

USE restaurant_qr;

-- Table for menu items
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    available BOOLEAN DEFAULT 1
);

-- Table for orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT,
    order_details TEXT,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tables
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE
);

-- Insert sample menu items
INSERT INTO menu (name, description, price, available) VALUES
('Pasta', 'Creamy Alfredo Pasta', 250.00, 1),
('Pizza', 'Cheese Burst Pizza', 300.00, 1),
('Burger', 'Loaded Chicken Burger', 180.00, 1);

-- Insert sample table numbers
INSERT INTO tables (table_number) VALUES (1), (2), (3);
CREATE DATABASE restaurant_qr;

USE restaurant_qr;

-- Table for menu items
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    available BOOLEAN DEFAULT 1
);

-- Table for orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT,
    order_details TEXT,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tables
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE
);

-- Insert sample menu items
INSERT INTO menu (name, description, price, available) VALUES
('Pasta', 'Creamy Alfredo Pasta', 250.00, 1),
('Pizza', 'Cheese Burst Pizza', 300.00, 1),
('Burger', 'Loaded Chicken Burger', 180.00, 1);

-- Insert sample table numbers
INSERT INTO tables (table_number) VALUES (1), (2), (3);


--New
CREATE TABLE tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_occupied BOOLEAN DEFAULT 0
);
CREATE TABLE menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255),
    price DECIMAL(10, 2)
);
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT,
    item_id INT,
    status VARCHAR(50)
);

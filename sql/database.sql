
-- Database schema for Giveaway Application
CREATE DATABASE IF NOT EXISTS giveaway_db;
USE giveaway_db;

-- Table for prizes/hadiah
CREATE TABLE IF NOT EXISTS prizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 1,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for participants/peserta
CREATE TABLE IF NOT EXISTS participants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for winners/pemenang (log)
CREATE TABLE IF NOT EXISTS winners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prize_id INT NOT NULL,
    participant_id INT NOT NULL,
    draw_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (prize_id) REFERENCES prizes(id) ON DELETE CASCADE,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO prizes (name, description, quantity) VALUES
('iPhone 15 Pro', 'Smartphone terbaru Apple dengan teknologi Pro', 1),
('Laptop Gaming', 'Laptop gaming dengan spesifikasi tinggi', 1),
('Voucher Belanja 500K', 'Voucher belanja senilai 500 ribu rupiah', 5),
('Headphone Wireless', 'Headphone bluetooth premium', 3);

INSERT INTO participants (name, email, phone) VALUES
('Ahmad Rizki', 'ahmad.rizki@email.com', '081234567890'),
('Siti Nurhaliza', 'siti.nur@email.com', '081234567891'),
('Budi Santoso', 'budi.santoso@email.com', '081234567892'),
('Dewi Lestari', 'dewi.lestari@email.com', '081234567893'),
('Eko Prasetyo', 'eko.prasetyo@email.com', '081234567894'),
('Fitri Handayani', 'fitri.handayani@email.com', '081234567895'),
('Gunawan Sutrisno', 'gunawan.sutrisno@email.com', '081234567896'),
('Hesti Purnamasari', 'hesti.purnamasari@email.com', '081234567897'),
('Indra Wijaya', 'indra.wijaya@email.com', '081234567898'),
('Joko Widodo', 'joko.widodo@email.com', '081234567899');

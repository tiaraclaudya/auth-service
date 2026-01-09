const mysql = require('mysql2');
require('dotenv').config();

// Buat koneksi ke database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Connect ke database
db.connect((err) => {
    if (err) {
        console.error('❌ Gagal konek ke database:', err.message);
        return;
    }
    console.log('✅ Terhubung ke database MySQL');
});

// Buat fungsi promise-based
const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = { db, query }; 
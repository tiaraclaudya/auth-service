const { query } = require('../config/database');

const userController = {
    // CREATE: Tambah user baru
    createUser: async (req, res) => {
        try {
            console.log(req.body)
            const { username, email, password, full_name } = req.body;
            
            // Validasi input
            if (!username || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Nama dan email harus diisi'
                });
            }
            
            // Cek email sudah ada
            const checkEmail = await query(
                'SELECT id FROM users WHERE email = ?',
                [email]
            );
            
            if (checkEmail.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }
            
            // Insert ke database
            const result = await query(
                'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                [username, email, password || null, full_name || null]
            );
            
            res.status(201).json({
                success: true,
                message: 'User berhasil dibuat',
                data: {
                    id: result.insertId,
                    username,
                    email,
                    password,
                    full_name,
                }
            });
            
        } catch (error) {
            console.error('Error create user:', error);
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    },
    
    // READ: Get semua users
    getAllUsers: async (req, res) => {
        try {
            const users = await query(
                'SELECT id, username, email, password, full_name, created_at, updated_at FROM users ORDER BY id DESC'
            );
            
            res.json({
                success: true,
                count: users.length,
                data: users 
            });
            
        } catch (error) {
            console.error('Error get users:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },
    
    // READ: Get user by ID
    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const users = await query(
                'SELECT id, username, email, password, full_name, created_at, updated_at FROM users WHERE id = ?',
                [id]
            );
            
            if (users.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            
            res.json({
                success: true,
                data: users[0]
            });
            
        } catch (error) {
            console.error('Error get user:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },
    
    // UPDATE: Update user
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, email, password, full_name } = req.body;
            
            // Cek user exist
            const checkUser = await query(
                'SELECT id FROM users WHERE id = ?',
                [id]
            );
            
            if (checkUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            
            // Cek email duplikat (kecuali email user ini)
            if (email) {
                const checkEmail = await query(
                    'SELECT id FROM users WHERE email = ? AND id != ?',
                    [email, id]
                );
                
                if (checkEmail.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email sudah digunakan user lain'
                    });
                }
            }
            
            // Build update query
            const updateFields = [];
            const values = [];
            
            if (username) {
                updateFields.push('username = ?');
                values.push(username);
            }
            if (email) {
                updateFields.push('email = ?');
                values.push(email);
            }
            if (password !== undefined) {
                updateFields.push('password = ?');
                values.push(password || null);
            }
            if (full_name !== undefined) {
                updateFields.push('full_name = ?');
                values.push(full_name || null);
            }
            
            if (updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Tidak ada data yang diupdate'
                });
            }
            
            values.push(id);
            
            // Update database
            await query(
                `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
                values
            );
            
            // Get updated data
            const updatedUser = await query(
                'SELECT id, username, email, password, full_name, created_at, updated_at FROM users WHERE id = ?',
                [id]
            );
            
            res.json({
                success: true,
                message: 'User berhasil diupdate',
                data: updatedUser[0]
            });
            
        } catch (error) {
            console.error('Error update user:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },
    
    // DELETE: Hapus user
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Cek user exist
            const checkUser = await query(
                'SELECT id, username FROM users WHERE id = ?',
                [id]
            );
            
            if (checkUser.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }
            
            // Delete user
            await query(
                'DELETE FROM users WHERE id = ?',
                [id]
            );
            
            res.json({
                success: true,
                message: `User "${checkUser[0].name}" berhasil dihapus`
            });
            
        } catch (error) {
            console.error('Error delete user:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },
    
    // SEARCH: Cari users
    searchUsers: async (req, res) => {
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({
                    success: false,
                    message: 'Parameter pencarian (q) diperlukan'
                });
            }
            
            const searchTerm = `%${q}%`;
            const users = await query(
                `SELECT id, username, email, password, full_name, created_at 
                 FROM users 
                 WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
                 ORDER BY name`,
                [searchTerm, searchTerm, searchTerm]
            );
            
            res.json({
                success: true,
                count: users.length,
                data: users
            });
            
        } catch (error) {
            console.error('Error search users:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};

module.exports = userController;
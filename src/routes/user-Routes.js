const express = require('express');
const router = express.Router();
const userController = require('../controller/user-Controller.js');

// CREATE - POST /api/users
router.post('/users', userController.createUser);

// READ ALL - GET /api/users
router.get('/users', userController.getAllUsers);

// SEARCH - GET /api/users/search
router.get('/users/search', userController.searchUsers);

// READ ONE - GET /api/users/:id
router.get('/users/:id', userController.getUserById);

// UPDATE - PUT /api/users/:id
router.put('/users/:id', userController.updateUser);

// DELETE - DELETE /api/users/:id
router.delete('/users/:id', userController.deleteUser);

// Home route
router.get('/', (req, res) => {
    res.json({
        service: 'User Management Service',
        version: '1.0.0',
        endpoints: {
            create_user: 'POST /api/users',
            get_all_users: 'GET /api/users',
            get_user: 'GET /api/users/:id',
            update_user: 'PUT /api/users/:id',
            delete_user: 'DELETE /api/users/:id',
            search_users: 'GET /api/users/search?q=keyword'
        }
    });
});

module.exports = router; 
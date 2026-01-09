require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 USER SERVICE BERJALAN`);
    console.log('='.repeat(50));
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Health: http://localhost:${PORT}/health`);
    console.log(`📍 API Docs: http://localhost:${PORT}/api`);
    console.log(`📍 Database: ${process.env.DB_NAME}`);
    console.log('='.repeat(50));
    console.log('Tekan CTRL+C untuk menghentikan server');
});
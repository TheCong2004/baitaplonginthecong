const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookingRoutes = require('./routes/bookings');

const app = express();



// Kết nối đến cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://localhost:27017/bookingSystem', {
  // Các tùy chọn lỗi thời đã được loại bỏ
})
.then(() => {
  console.log('Kết nối đến cơ sở dữ liệu MongoDB thành công.');
})
.catch(err => {
  console.error('Lỗi kết nối đến cơ sở dữ liệu MongoDB:', err);
});

// Middleware để phân tích body của yêu cầu
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // Để xử lý JSON, nếu cần
app.use(express.static('public')); // Để phục vụ các tệp tĩnh
app.set('view engine', 'ejs'); // Thiết lập EJS làm view engine

// Route cho đường dẫn gốc
app.get('/', (req, res) => {
  res.redirect('/bookings'); // Chuyển hướng đến trang đặt chỗ
});

// Sử dụng các route cho bookings
app.use('/bookings', bookingRoutes);

// Khởi động máy chủ
const PORT = process.env.PORT || 3000; // Sử dụng biến môi trường PORT nếu có
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Hiển thị danh sách lịch đặt chỗ
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find(); // Lấy danh sách đặt chỗ từ cơ sở dữ liệu
    res.render('bookings', { bookings }); // Render trang bookings với dữ liệu
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt chỗ:', error);
    res.status(500).send('Lỗi khi lấy danh sách đặt chỗ');
  }
});

// Trang đặt chỗ mới
router.get('/create', (req, res) => {
  res.render('createBooking'); // Render trang tạo đặt chỗ mới
});

// Tạo đặt chỗ mới
router.post('/', async (req, res) => { // Đổi từ '/create' thành '/'
  const { name, email, date, time, guests } = req.body; // Cập nhật tên trường

  try {
    // Kiểm tra trùng lặp
    const existingBooking = await Booking.findOne({ date, time });
    if (existingBooking) {
      return res.send('Đặt chỗ trùng thời gian.');
    }

    const newBooking = new Booking({ customerName: name, email, date, time, guests }); // Cập nhật tên trường
    await newBooking.save(); // Lưu đặt chỗ mới vào cơ sở dữ liệu
    res.redirect('/bookings'); // Chuyển hướng về danh sách đặt chỗ
  } catch (error) {
    console.error('Lỗi khi tạo đặt chỗ:', error);
    res.status(500).send('Lỗi khi tạo đặt chỗ');
  }
});

// Trang sửa thông tin đặt chỗ
router.get('/edit/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send('Không tìm thấy đặt chỗ.');
    }
    res.render('editBooking', { booking }); // Render trang chỉnh sửa đặt chỗ
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đặt chỗ:', error);
    res.status(500).send('Lỗi khi lấy thông tin đặt chỗ');
  }
});

// Cập nhật thông tin đặt chỗ
router.post('/edit/:id', async (req, res) => {
  const { customerName, date, time } = req.body;
  try {
    await Booking.findByIdAndUpdate(req.params.id, { customerName, date, time });
    res.redirect('/bookings'); // Chuyển hướng về danh sách đặt chỗ
  } catch (error) {
    console.error('Lỗi khi cập nhật đặt chỗ:', error);
    res.status(500).send('Lỗi khi cập nhật đặt chỗ');
  }
});

// Hủy đặt chỗ
router.post('/cancel/:id', async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: 'Cancelled' });
    res.redirect('/bookings'); // Chuyển hướng về danh sách đặt chỗ
  } catch (error) {
    console.error('Lỗi khi hủy đặt chỗ:', error);
    res.status(500).send('Lỗi khi hủy đặt chỗ');
  }
});

module.exports = router;
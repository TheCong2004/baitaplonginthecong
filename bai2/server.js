const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Đọc dữ liệu từ file vung.json
let vungData;
try {
    // Đọc file vung.json và chuyển đổi dữ liệu JSON thành đối tượng JavaScript
    const rawData = fs.readFileSync('vung.json', 'utf8');
    vungData = JSON.parse(rawData);
    console.log('Dữ liệu đã được đọc thành công:', vungData);
} catch (error) {
    // Xử lý lỗi khi không đọc được file vung.json
    console.error('Lỗi khi đọc file vung.json:', error);
    vungData = {};
}

// Sử dụng middleware để cung cấp các file tĩnh trong thư mục 'public'
app.use(express.static('public'));

// Endpoint để lấy danh sách các tỉnh thành
app.get('/api/provinces', (req, res) => {
    // Lấy các tên tỉnh thành từ dữ liệu JSON đã đọc
    const provinces = Object.keys(vungData);
    // Trả về danh sách các tỉnh thành dưới dạng JSON
    res.json(provinces);
});

// Endpoint để tra cứu thông tin biển số dựa trên tên tỉnh thành
app.get('/api/lookup/:province', (req, res) => {
    const { province } = req.params; // Lấy tên tỉnh từ URL
    console.log('Tìm kiếm cho tỉnh:', province);
    
    // Lấy thông tin biển số của tỉnh thành đã chọn từ dữ liệu JSON
    const plateInfo = vungData[province];
    console.log('Kết quả tìm kiếm:', plateInfo);
    
    if (plateInfo) {
        // Nếu tìm thấy thông tin, trả về thông tin đó dưới dạng JSON
        res.json({ plateInfo });
    } else {
        // Nếu không tìm thấy thông tin, trả về thông báo không tìm thấy
        res.json({ plateInfo: 'Không tìm thấy thông tin' });
    }
});

// Khởi động server và lắng nghe tại cổng 3000
app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});

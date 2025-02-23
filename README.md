# Công nghệ mới

## Thực hành buổi 2 - 23/02/2024

### Khởi tạo dự án Node.js

```bash
npm init -y
```

### Cài đặt các dependencies

```bash
npm install express ejs nodemon
```

### Cấu trúc project

1. Tạo file `index.js`
2. Tạo thư mục `views` cho các template
3. Tạo các file giao diện:

- `views/index.ejs` - Template chính
- `views/index.css` - File styles

### Script chạy dự án

Thêm vào `package.json`:

```json
"scripts": {
  "start": "nodemon index.js"
}
```

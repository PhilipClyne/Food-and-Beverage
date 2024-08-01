const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoute = require('./routes/authRoute');
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const toppingRoute = require('./routes/toppingRoute');
const formulaRoute = require('./routes/formulaRoute');
const attributeRoute = require('./routes/attributeRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
const userRoute = require('./routes/userRoute');
const app = express();

dotenv.config();
// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

// Cấu hình để Express phục vụ các file tĩnh từ thư mục uploads bên ngoài backend và admin_fe
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);
app.use('/api/toppings', toppingRoute);
app.use('/api/formulas', formulaRoute);
app.use('/api/attribute', attributeRoute);
app.use('/api/carts', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/users', userRoute);
// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

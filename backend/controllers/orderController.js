const Order = require('../models/orderModel');
const OrderDetail = require('../models/orderDetailModel');
const Cart = require('../models/cartModel');
const CartItem = require('../models/cartItemModel');
const User = require('../models/userModel');
// Create a new order
const createOrder = async (req, res) => {
    const { cartId } = req.body;// Assuming req.user contains the logged-in user's info
    const userId = req.body.userId || null;
    console.log("Received cartId:", cartId);

    if (!cartId) {
        return res.status(400).json({ message: 'Cart ID is required' });
    }

    try {
        // Fetch cart and its items
        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log("Fetched cart:", cart);

        // Create order details from cart items
        const orderDetails = await Promise.all(
            cart.items.map(async (item) => {
                const orderDetail = new OrderDetail({
                    productId: item.productId,
                    productImage: item.productImage,
                    productName: item.productName,
                    price: item.price,
                    quantity: item.quantity
                });
                await orderDetail.save();
                return orderDetail._id;
            })
        );

        console.log("Order details created:", orderDetails);

        // Create order
        const newOrder = new Order({
            soldById: userId || null,
            orderDetails: orderDetails,
            status: 1, // Default status: 'chưa xác nhận'
            statusValue: 'chưa xác nhận',
            totalQuantity: cart.items.reduce((total, item) => total + item.quantity, 0),
            total: cart.totalPrice,
            purchaseDate: Date.now(),
            historyNote: ''
        });

        await newOrder.save();
        console.log("Order saved:", newOrder);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order', error });
    }
};
// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('orderDetails');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Get orders by status
const getOrdersByStatus = async (req, res) => {
    const { status } = req.query;

    try {
        let orders;
        if (status !== undefined) {
            const statusInt = parseInt(status, 10);
            orders = await Order.find({ status: statusInt }).populate('orderDetails');
        } else {
            orders = await Order.find().populate('orderDetails');
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders by status', error });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('orderDetails');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Update order
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        Object.assign(order, req.body);
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Confirm order
const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.soldById) {
            const user = await User.findById(order.soldById);
            if (user) {
                user.successfulOrders = user.successfulOrders ? user.successfulOrders + 1 : 1;
                await user.save();
            }
        }

        order.status = 2; // Confirm order in Order model
        order.statusValue = 'Đã xác nhận';
        order.orderComplete = new Date();
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.soldById) {
            const user = await User.findById(order.soldById);
            if (user) {
                if (order.status === 2) { // Nếu đơn hàng đã được xác nhận
                    user.successfulOrders = Math.max(user.successfulOrders - 1, 0); // Trừ successfulOrders nếu không âm
                }
                user.canceledOrders = user.canceledOrders ? user.canceledOrders + 1 : 1;
                await user.save();
            }
        }

        order.status = 3;
        order.statusValue = 'đã hủy';
        order.orderComplete = new Date();
        await order.save();

        res.status(200).json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

const getTotalRevenue = async (req, res) => {
    const { startDate, endDate, userId } = req.query;

    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set startDate to the beginning of the day
    start.setHours(0, 0, 0, 0);

    // Set endDate to the end of the day
    end.setHours(23, 59, 59, 999);

    // Log the start and end dates for debugging
    console.log(`Start Date: ${start}`);
    console.log(`End Date: ${end}`);

    const filterComplete = {
        orderComplete: {
            $gte: start,
            $lte: end
        }
    };

    const filterPending = {
        purchaseDate: {
            $gte: start,
            $lte: end
        }
    };

    if (userId) {
        filterComplete.soldById = userId;
        filterPending.soldById = userId;
    }

    try {
        const confirmedOrders = await Order.find({
            ...filterComplete,
            status: 2 // Đơn hàng đã xác nhận
        });

        const cancelledOrders = await Order.find({
            ...filterComplete,
            status: 3 // Đơn hàng đã hủy
        });

        const pendingOrders = await Order.find({
            ...filterPending,
            status: 1 // Đơn hàng đang chờ
        });

        const totalRevenue = confirmedOrders.reduce((total, order) => total + order.total, 0);

        res.status(200).json({
            totalRevenue,
            totalConfirmOrders: confirmedOrders.length,
            totalCancelledOrders: cancelledOrders.length,
            totalPendingOrders: pendingOrders.length,
            confirmedOrders,
            cancelledOrders,
            pendingOrders
        });
    } catch (error) {
        console.error('Error fetching total revenue:', error);
        res.status(500).json({ message: 'Error fetching total revenue', error });
    }
};




module.exports = {
    createOrder,
    getAllOrders,
    getOrdersByStatus,
    getOrderById,
    updateOrder,
    confirmOrder,
    cancelOrder,
    getTotalRevenue,
};

import mongoose from 'mongoose';
import connectDB from './mongodb';
import Product from './models/product';
import User from './models/user';
import Order from './models/order';
import { decryptSensitiveData } from './encryption';

// Timeout değeri (millisaniye)
const QUERY_TIMEOUT = 60000; // 60 saniye

export async function getProducts(limit = 8) {
  try {
    await connectDB();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB query timed out')), QUERY_TIMEOUT)
    );
    
    const queryPromise = Product.find({
      $or: [
        { inStock: true },
        { featured: true }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
                              
    let products = await Promise.race([queryPromise, timeoutPromise]);
    // Remove _id from sizes for each product
    products = (products || []).map(product => ({
      ...product,
      sizes: (product.sizes || []).map(({ size, stock }) => ({ size, stock }))
    }));
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to get products:', error);
    // Return empty array instead of throwing error
    return [];
  }
}

export async function getProductById(id) {
  try {
    await connectDB();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('MongoDB query timed out')), QUERY_TIMEOUT)
    );
    
    const queryPromise = Product.findById(id).lean().exec();
    
    let product = await Promise.race([queryPromise, timeoutPromise]);
    
    if (!product) {
      return null;
    }
    // Remove _id from sizes
    product.sizes = (product.sizes || []).map(({ size, stock }) => ({ size, stock }));
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error getting product by id:', error);
    return null;
  }
}

export async function getUsers() {
  return getAllUsers();
}

export async function getAllUsers() {
  try {
    await connectDB();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Users query timeout')), 8000)
    );
    
    const dbPromise = User.find().select('-password').lean().exec();
    
    const users = await Promise.race([dbPromise, timeoutPromise]);
    
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    await connectDB();
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return null;
    }
    
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Error getting user by id:', error);
    return null;
  }
}

export async function getUserOrders(userId) {
  try {
    await connectDB();
    
    if (mongoose.connection.readyState === 1) { // 1 = connected
      let orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean().exec();
      orders = JSON.parse(JSON.stringify(orders));
      return orders;
    } else {
      throw new Error('MongoDB not connected');
    }
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

export async function getAllOrders() {
  try {
    await connectDB();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Orders query timeout')), 8000)
    );
    
    const dbPromise = Order.find().sort({ createdAt: -1 }).lean().exec();
    
    const orders = await Promise.race([dbPromise, timeoutPromise]);
    
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId) {
  try {
    await connectDB();
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Order query timeout')), 8000)
    );
    
    const dbPromise = Order.findById(orderId).lean().exec();
    
    const order = await Promise.race([dbPromise, timeoutPromise]);
    
    if (!order) {
      return null;
    }
    

    
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error('Error getting order by id:', error);
    return null;
  }
}

export async function toggleUserBan(userId) {
  try {
    await connectDB();
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.isBanned = !user.isBanned;
    await user.save();
    
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
  } catch (error) {
    console.error('Error toggling user ban status:', error);
    throw error;
  }
}

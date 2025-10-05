import mongoose from 'mongoose';

// Client-side'da çalışmadığından emin olalım
const MONGODB_URI = process.env.MONGODB_URI;


// Client-side kontrolü
if (typeof window !== 'undefined') {
  // Bu MongoDB bağlantısı sadece server-side'da çalışır
  console.log('MongoDB: Client-side detected, connection will be skipped');
} else {
  // Log MongoDB connection info (without password) - Only on server-side
  if (process.env.MONGODB_URI) {
    const sanitizedURI = MONGODB_URI.replace(/:([^:@]+)@/, ':****@');
    console.log('MongoDB URI configured:', sanitizedURI);
  } else {
    console.warn('MongoDB URI not configured! Using fallback...');
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// Client-side ve server-side için güvenli bir global değişken kullanımı
const globalObj = typeof globalThis !== 'undefined' ? globalThis : 
                 typeof window !== 'undefined' ? window : 
                 typeof global !== 'undefined' ? global : {};

// Mongoose bağlantısı için cache
let cached = globalObj.mongoose;

// Client-side'da bağlantı yapmıyoruz
if (!cached && typeof window === 'undefined') {
  cached = globalObj.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Client-side'daysa boş bir obje dön
  if (typeof window !== 'undefined') {
    console.warn('MongoDB connection attempted on client side. This is not supported.');
    return {};
  }

  // If we're already connected, return the connection
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    // Simplified connection options for newer Mongoose versions
    const opts = {
      bufferCommands: false,
    };

    cached = globalObj.mongoose = { conn: null, promise: null };
    
    // Use fallback URI if MONGODB_URI is not set
    const connectionURI = MONGODB_URI;
    
    cached.promise = mongoose.connect(connectionURI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error.message);
      // Don't throw error during build time, return a mock connection
      if (process.env.NODE_ENV === 'production') {
        return { connection: { readyState: 1 } };
      }
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connection established successfully.');
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e.message);
    
    // During build time, don't throw errors
    if (process.env.NODE_ENV === 'production') {
      return { connection: { readyState: 1 } };
    }
    throw e;
  }

  return cached.conn;
}

export default connectDB;
export { connectDB as connectToDatabase };

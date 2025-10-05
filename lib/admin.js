import connectDB from './mongodb';
import User from './models/user';
import { getUsers } from './data';

export default async function getUsersForAdmin() {
  // This is a server component function to get users for the admin panel
  try {
    const users = await getUsers();
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

// Middleware to check if a user is banned
export async function checkBannedUser(session) {
  // No session means user is not authenticated
  if (!session) {
    return false;
  }
  
  try {
    // Check in database
    await connectDB();
    const user = await User.findById(session.user.id);
    return user?.isBanned || false;
  } catch (error) {
    console.error('Error checking banned status:', error);
    return false;
  }
}

// Middleware to protect API routes from banned users
export async function protectFromBannedUsers(request) {
  try {
    // Get Authorization header
    const authHeader = request?.headers?.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { allowed: false, reason: 'unauthorized', session: null };
    }
    
    // Extract user data from token (in this case, it's JSON encoded user data)
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const userData = JSON.parse(decodeURIComponent(token));
      
      // Check if user is banned
      await connectDB();
      const user = await User.findById(userData._id);
      
      if (!user) {
        return { allowed: false, reason: 'user_not_found', session: null };
      }
      
      if (user.isBanned) {
        return { allowed: false, reason: 'banned', session: null };
      }
      
      return { 
        allowed: true, 
        session: { 
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      };
      
    } catch (parseError) {
      console.error('Error parsing user token:', parseError);
      return { allowed: false, reason: 'invalid_token', session: null };
    }
    
  } catch (error) {
    console.error('Error in protectFromBannedUsers:', error);
    return { allowed: false, reason: 'server_error', session: null };
  }
}

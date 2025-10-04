// Admin User Creation Script
// This script creates an admin user for the platform

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

async function createAdminUser() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('ghar-ka-khana');
    
    // Admin user details
    const adminEmail = 'admin@gharkaakhana.com';
    const adminPassword = 'admin123'; // Change this in production!
    const adminName = 'System Administrator';
    
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create admin user
    const adminUser = {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isApproved: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const result = await db.collection('users').insertOne(adminUser);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 User ID:', result.insertedId);
    console.log('⚠️  Please change the password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser().catch(console.error);
}

export default createAdminUser;
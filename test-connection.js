const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect('mongodb://localhost:27017/auth');
    console.log('✅ MongoDB connected successfully!');
    
    // Проверим создание базы данных
    const testSchema = new mongoose.Schema({
      name: String
    });
    const Test = mongoose.model('Test', testSchema);
    
    const testDoc = new Test({ name: 'Connection Test' });
    await testDoc.save();
    console.log('✅ Test data saved successfully!');
    
    const docs = await Test.find();
    console.log('✅ Data retrieved:', docs);
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    process.exit(1);
  }
}

testConnection();
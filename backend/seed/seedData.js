import axios from 'axios';
import Transaction from '../models/transaction.js';
import connectDB from '../config/db.js';

const seedDatabase = async () => {
  try {
    connectDB();
    const { data } = await axios.get(
      'https://s3.amazonaws.com/roxiler.com/product_transaction.json'
    );
    await Transaction.deleteMany({});
    await Transaction.insertMany(data);
    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

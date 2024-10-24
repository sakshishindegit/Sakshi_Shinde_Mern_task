import Transaction from '../models/transaction.js';

export const getTransactions = async (req, res) => {
  const { month, page = 1, itemsPerPage = 10, search = '' } = req.query;

  if (!/^(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({
      error:
        'Invalid month format. Month must be in MM format (e.g., 01 for January).',
    });
  }

  try {
    const transactions = await Transaction.find({
      dateOfSale: {
        $gte: new Date(new Date().getFullYear(), parseInt(month) - 1, 1), 
        $lte: new Date(
          new Date().getFullYear(),
          parseInt(month),
          0,
          23,
          59,
          59,
          999
        ), 
      },
      $or: [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { price: new RegExp(search, 'i') },
      ],
    })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    if (transactions.length === 0) {
      return res.status(404).json({
        message:
          'No transactions found for the specified month and search criteria.',
      });
    }

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      error:
        'An error occurred while fetching transactions. Please try again later.',
    });
  }
};

export const getTransactionStats = async (req, res) => {
  const { month } = req.query;

  if (!/^(0[1-9]|1[0-2])$/.test(month)) {
    return res.status(400).json({
      error:
        'Invalid month format. Month must be in MM format (e.g., 01 for January).',
    });
  }

  const year = new Date().getFullYear(); 
  const startDate = new Date(year, parseInt(month) - 1, 1); 
  const endDate = new Date(year, parseInt(month), 0, 23, 59, 59, 999); 

  try {
    const [totalSoldItems, totalNotSoldItems] = await Promise.all([
      Transaction.countDocuments({
        sold: true,
        dateOfSale: { $gte: startDate, $lte: endDate }, 
      }),
      Transaction.countDocuments({
        sold: false,
        dateOfSale: { $gte: startDate, $lte: endDate }, 
      }),
    ]);

    const totalSalesAmount = await Transaction.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startDate, $lte: endDate }, 
          sold: true,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$price' },
        },
      },
    ]);

    res.json({
      totalSoldItems,
      totalNotSoldItems,
      totalSalesAmount: totalSalesAmount[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.error('Error fetching transaction statistics:', error);
    res.status(500).json({
      error:
        'An error occurred while fetching transaction statistics. Please try again later.',
    });
  }
};

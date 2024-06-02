module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('order_statuses', [
      {
        id: 1,
        name: 'Order Placed',
        description: 'The customer has placed the order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Payment Pending',
        description: 'Awaiting payment confirmation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Payment Confirmed',
        description: 'Payment has been successfully processed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Failed Payment',
        description: 'The payment attempt has failed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Order Processing',
        description: 'The order is being prepared',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: 'Awaiting Stock',
        description: 'Waiting for stock to fulfill the order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: 'Order Packed',
        description: 'The order has been packed and is ready for shipping',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: 'Ready for Shipment',
        description: 'The order is ready to be handed over to the courier',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        name: 'Shipped',
        description: 'The order has been handed over to the courier and is on its way',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        name: 'In Transit',
        description: 'The order is currently being transported to the delivery address',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        name: 'Out for Delivery',
        description: 'The order is out for delivery to the customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        name: 'Attempted Delivery',
        description: 'Delivery was attempted but was not successful',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        name: 'Delivered',
        description: 'The order has been delivered to the customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 14,
        name: 'Completed',
        description: 'The order has been delivered and marked as completed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 15,
        name: 'Cancelled',
        description: 'The order has been cancelled',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 16,
        name: 'Return Requested',
        description: 'The customer has requested to return the order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 17,
        name: 'Return Approved',
        description: 'The return request has been approved',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 18,
        name: 'Return In Transit',
        description: 'The returned order is on its way back',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 19,
        name: 'Return Received',
        description: 'The returned order has been received',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 20,
        name: 'Refund Initiated',
        description: 'The refund process has been started',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 21,
        name: 'Refund Processed',
        description: 'The refund has been processed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 22,
        name: 'Returned to Sender',
        description: 'The order is being returned to the sender',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 23,
        name: 'On Hold',
        description: 'The order is on hold for some reason (e.g., awaiting customer response)',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 24,
        name: 'Partially Shipped',
        description: 'Part of the order has been shipped',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 25,
        name: 'Partially Delivered',
        description: 'Part of the order has been delivered',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 26,
        name: 'Awaiting Pickup',
        description: 'The order is ready for the customer to pick up',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 27,
        name: 'Pickup Completed',
        description: 'The customer has picked up the order',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('product_statuses', null, {});
    await queryInterface.sequelize.query('ALTER TABLE product_statuses AUTO_INCREMENT = 1;');
  },
};

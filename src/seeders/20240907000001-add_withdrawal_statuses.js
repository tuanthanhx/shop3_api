module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('withdrawal_statuses', [
      {
        name: 'Pending',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Completed',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Canceled',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Declined',
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
};

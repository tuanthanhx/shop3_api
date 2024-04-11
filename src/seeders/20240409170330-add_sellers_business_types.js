module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('seller_business_types', [
      {
        name: 'Household',
        description: 'By selecting "Household", you indicate that you have the certificate of household business registration. Please note that you are only able to bind a household bank account to withdraw settlement amounts',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Individual',
        description: 'When onboarding as a sole trader, please select \'Individual\' business type. Please note that we only accept applications from sole traders in Vietnam with an identity card or passport.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Corporate',
        description: 'When onboarding as a company, please select \'Corporate\' business type. Please note that company will need to provide a business license.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('seller_business_types', null, {});
    await queryInterface.sequelize.query('ALTER TABLE seller_business_types AUTO_INCREMENT = 1;');
  },
};

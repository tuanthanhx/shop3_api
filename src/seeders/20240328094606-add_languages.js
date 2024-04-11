module.exports = {
  async up(queryInterface) {
    const languages = [
      'Chinese',
      'English',
      'French',
      'Hausa',
      'Hindi',
      'Italian',
      'Japanese',
      'Korean',
      'Russian',
      'Vietnamese',
    ];
    const languageObjects = languages.map((language) => ({
      name: language,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await queryInterface.bulkInsert('languages', languageObjects, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('languages', null, {});
    await queryInterface.sequelize.query('ALTER TABLE languages AUTO_INCREMENT = 1;');
  },
};

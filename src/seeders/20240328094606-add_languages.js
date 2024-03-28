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
      created_at: new Date(),
      updated_at: new Date(),
    }));
    await queryInterface.bulkInsert('Languages', languageObjects, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Languages', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Languages AUTO_INCREMENT = 1;');
  },
};

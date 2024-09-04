module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Home Supplies',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kitchenware',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Textiles & Soft Furnishings',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Household Appliances',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Womenswear & Underwear',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Muslim Fashion',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Shoes',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Beauty & Personal Care',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Phones & Electronics',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Computers & Office Equipment',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Pet Supplies',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Baby & Maternity',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sports & Outdoor',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Toys & Hobbies',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Furniture',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Tools & Hardware',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Home Improvement',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Automotive & Motorcycle',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fashion Accessories',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Food & Beverages',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Books, Magazines & Audio',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kids\' Fashion',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Menswear & Underwear',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Luggage & Bags',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Collectibles',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Jewelry Accessories & Derivatives',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Home Organizers',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Bathroom Supplies',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Home Decor',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Home Care Supplies',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Laundry Tools & Accessories',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Festive & Party Supplies',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Miscellaneous Home',
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.sequelize.query('ALTER TABLE categories AUTO_INCREMENT = 1;');
  },
};

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('internships', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: Sequelize.STRING(255), allowNull: false },
    institution: { type: Sequelize.STRING(255), allowNull: true },
    description: { type: Sequelize.TEXT, allowNull: false },
    country: { type: Sequelize.STRING(100), allowNull: false },
    deadline: { type: Sequelize.DATE, allowNull: true },
    type: { type: Sequelize.STRING(100), allowNull: true },
    link: { type: Sequelize.TEXT, allowNull: true },
    startDate: { type: Sequelize.DATE, allowNull: true },
    endDate: { type: Sequelize.DATE, allowNull: true },
    imageUrl: { type: Sequelize.TEXT, allowNull: true },
    imagePublicId: { type: Sequelize.STRING(255), allowNull: true },
    createdById: {
      type: Sequelize.UUID, allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('internships', ['country']);
  await queryInterface.addIndex('internships', ['createdAt']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('internships');
}

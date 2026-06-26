export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('blogs', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: Sequelize.STRING(255), allowNull: false },
    content: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    imageUrl: { type: Sequelize.TEXT, allowNull: true },
    imagePublicId: { type: Sequelize.STRING(255), allowNull: true },
    published: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdById: {
      type: Sequelize.UUID, allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('blogs', ['published']);
  await queryInterface.addIndex('blogs', ['createdAt']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('blogs');
}

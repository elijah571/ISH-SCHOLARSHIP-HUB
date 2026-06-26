export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user_sessions', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    userId: {
      type: Sequelize.UUID, allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    refreshToken: { type: Sequelize.STRING(512), allowNull: false, unique: true },
    userAgent: { type: Sequelize.TEXT, allowNull: true },
    ipAddress: { type: Sequelize.STRING(64), allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('user_sessions', ['userId']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('user_sessions');
}

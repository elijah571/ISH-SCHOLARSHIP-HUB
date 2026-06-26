/** @param {import('sequelize').QueryInterface} queryInterface */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    fullName: { type: Sequelize.STRING(120), allowNull: false },
    email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    password: { type: Sequelize.STRING(255), allowNull: false },
    role: { type: Sequelize.ENUM('user', 'admin'), defaultValue: 'user', allowNull: false },
    isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
    resetPasswordToken: { type: Sequelize.STRING(255), allowNull: true },
    resetPasswordTokenExpires: { type: Sequelize.DATE, allowNull: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addIndex('users', ['role']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('users');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role"');
}

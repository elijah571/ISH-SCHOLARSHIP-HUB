export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('user_saved_scholarships', {
    userId: {
      type: Sequelize.UUID, allowNull: false, primaryKey: true,
      references: { model: 'users', key: 'id' }, onDelete: 'CASCADE',
    },
    scholarshipId: {
      type: Sequelize.UUID, allowNull: false, primaryKey: true,
      references: { model: 'scholarships', key: 'id' }, onDelete: 'CASCADE',
    },
    savedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  await queryInterface.createTable('user_applied_scholarships', {
    userId: {
      type: Sequelize.UUID, allowNull: false, primaryKey: true,
      references: { model: 'users', key: 'id' }, onDelete: 'CASCADE',
    },
    scholarshipId: {
      type: Sequelize.UUID, allowNull: false, primaryKey: true,
      references: { model: 'scholarships', key: 'id' }, onDelete: 'CASCADE',
    },
    appliedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('user_applied_scholarships');
  await queryInterface.dropTable('user_saved_scholarships');
}

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('scholarships', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: Sequelize.STRING(255), allowNull: false },
    description: { type: Sequelize.TEXT, allowNull: false },
    country: { type: Sequelize.STRING(100), allowNull: false },
    deadline: { type: Sequelize.DATE, allowNull: false },
    fundingType: { type: Sequelize.STRING(100), allowNull: true },
    link: { type: Sequelize.TEXT, allowNull: false },
    duration: { type: Sequelize.STRING(100), allowNull: false },
    fieldOfStudy: { type: Sequelize.STRING(255), allowNull: true },
    location: { type: Sequelize.STRING(255), allowNull: true },
    university: { type: Sequelize.STRING(255), allowNull: true },
    tuitionFees: { type: Sequelize.STRING(255), allowNull: true },
    format: { type: Sequelize.STRING(100), allowNull: true },
    attendance: { type: Sequelize.STRING(100), allowNull: true },
    degreeType: { type: Sequelize.STRING(100), allowNull: true },
    specialProgramme: { type: Sequelize.STRING(255), allowNull: true },
    imageUrl: { type: Sequelize.TEXT, allowNull: true },
    imagePublicId: { type: Sequelize.STRING(255), allowNull: true },
    createdById: {
      type: Sequelize.UUID, allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('scholarships', ['country']);
  await queryInterface.addIndex('scholarships', ['fundingType']);
  await queryInterface.addIndex('scholarships', ['deadline']);
  await queryInterface.addIndex('scholarships', ['createdAt']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('scholarships');
}

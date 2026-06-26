export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('newsletters', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
    subscribedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.sequelize.query(`
    CREATE TYPE activity_action AS ENUM (
      'registered', 'applied', 'saved', 'unsaved',
      'blog_created', 'blog_updated', 'blog_deleted',
      'scholarship_created', 'scholarship_updated', 'scholarship_deleted',
      'internship_created', 'internship_updated', 'internship_deleted',
      'newsletter_subscribed', 'user_created', 'admin_created', 'user_updated', 'user_deleted'
    )
  `);

  await queryInterface.sequelize.query(`
    CREATE TYPE activity_target_type AS ENUM (
      'user', 'scholarship', 'internship', 'blog', 'newsletter'
    )
  `);

  await queryInterface.createTable('activities', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
    userName: { type: Sequelize.STRING(120), allowNull: false },
    userEmail: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
    action: { type: '"activity_action"', allowNull: false },
    targetType: { type: '"activity_target_type"', allowNull: false },
    targetId: { type: Sequelize.STRING(255), allowNull: false },
    targetTitle: { type: Sequelize.STRING(255), allowNull: false, defaultValue: '' },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('activities', ['createdAt']);
  await queryInterface.addIndex('activities', ['userId']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('activities');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS activity_action');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS activity_target_type');
  await queryInterface.dropTable('newsletters');
}

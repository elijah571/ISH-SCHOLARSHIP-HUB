export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('conversations', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    participantId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
    adminId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
    subject: { type: Sequelize.STRING(255), defaultValue: 'Admin Support' },
    status: { type: Sequelize.ENUM('active', 'closed', 'pending'), defaultValue: 'active' },
    lastMessage: { type: Sequelize.TEXT, allowNull: true },
    lastMessageTime: { type: Sequelize.DATE, allowNull: true },
    participantUnread: { type: Sequelize.INTEGER, defaultValue: 0 },
    adminUnread: { type: Sequelize.INTEGER, defaultValue: 0 },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('conversations', ['participantId']);
  await queryInterface.addIndex('conversations', ['isActive']);
  await queryInterface.addIndex('conversations', ['lastMessageTime']);

  await queryInterface.createTable('messages', {
    id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    conversationId: {
      type: Sequelize.UUID, allowNull: false,
      references: { model: 'conversations', key: 'id' }, onDelete: 'CASCADE',
    },
    senderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' } },
    senderRole: { type: Sequelize.ENUM('user', 'admin'), allowNull: false },
    message: { type: Sequelize.TEXT, allowNull: false },
    attachments: { type: Sequelize.JSONB, defaultValue: [] },
    isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
    readAt: { type: Sequelize.DATE, allowNull: true },
    editedAt: { type: Sequelize.DATE, allowNull: true },
    isDeleted: { type: Sequelize.BOOLEAN, defaultValue: false },
    createdAt: { type: Sequelize.DATE, allowNull: false },
    updatedAt: { type: Sequelize.DATE, allowNull: false },
  });

  await queryInterface.addIndex('messages', ['conversationId']);
  await queryInterface.addIndex('messages', ['isDeleted']);
}

export async function down(queryInterface) {
  await queryInterface.dropTable('messages');
  await queryInterface.dropTable('conversations');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_conversations_status"');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_messages_senderRole"');
}

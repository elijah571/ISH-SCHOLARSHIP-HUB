import { Op } from 'sequelize';
import { Conversation, Message, User } from '../../database/models/index.js';

const userAttrs = { attributes: ['id', 'fullName', 'email', 'role'] };
const conversationIncludes = [
  { model: User, as: 'participant', ...userAttrs },
  { model: User, as: 'admin', ...userAttrs },
];

export const chatRepo = {
  findConversationById: (id) =>
    Conversation.findByPk(id, { include: conversationIncludes }),

  findActiveConversationByParticipant: (participantId) =>
    Conversation.findOne({
      where: { participantId, isActive: true },
      include: conversationIncludes,
    }),

  createConversation: (data) =>
    Conversation.create(data).then((c) => c.reload({ include: conversationIncludes })),

  getAdminConversations: async (page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const { rows: conversations, count: total } = await Conversation.findAndCountAll({
      where: { isActive: true },
      order: [['lastMessageTime', 'DESC']],
      offset,
      limit,
      include: conversationIncludes,
    });
    return { conversations, total };
  },

  getUserConversations: async (userId, page = 1, limit = 20) => {
    const offset = (page - 1) * limit;
    const { rows: conversations, count: total } = await Conversation.findAndCountAll({
      where: { participantId: userId, isActive: true },
      order: [['lastMessageTime', 'DESC']],
      offset,
      limit,
      include: conversationIncludes,
    });
    return { conversations, total };
  },

  updateConversation: (id, data) =>
    Conversation.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  searchConversations: async (query) => {
    const matchedUsers = await User.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ['id'],
    });

    const userIds = matchedUsers.map((u) => u.id);
    const where = {
      isActive: true,
      [Op.or]: [
        { subject: { [Op.iLike]: `%${query}%` } },
        { lastMessage: { [Op.iLike]: `%${query}%` } },
        ...(userIds.length ? [{ participantId: { [Op.in]: userIds } }] : []),
      ],
    };

    return Conversation.findAll({
      where,
      order: [['lastMessageTime', 'DESC']],
      limit: 20,
      include: conversationIncludes,
    });
  },

  getMessages: async (conversationId, page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const { rows: messages, count: total } = await Message.findAndCountAll({
      where: { conversationId, isDeleted: false },
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      include: [{ model: User, as: 'sender', ...userAttrs }],
    });
    return { messages: messages.reverse(), total };
  },

  createMessage: (data) =>
    Message.create(data).then((m) => m.reload({ include: [{ model: User, as: 'sender', ...userAttrs }] })),

  findMessageById: (id) =>
    Message.findByPk(id, { include: [{ model: User, as: 'sender', ...userAttrs }] }),

  updateMessage: (id, data) =>
    Message.update(data, { where: { id }, returning: true }).then(([, rows]) => rows[0]),

  markMessagesRead: (conversationId, excludeSenderId) =>
    Message.update(
      { isRead: true, readAt: new Date() },
      { where: { conversationId, isRead: false, senderId: { [Op.ne]: excludeSenderId } } }
    ),

  countActive: () => Conversation.count({ where: { status: 'active' } }),
  countClosed: () => Conversation.count({ where: { status: 'closed' } }),
  countUnread: () => Conversation.count({ where: { adminUnread: { [Op.gt]: 0 } } }),
  countMessages: () => Message.count(),
};

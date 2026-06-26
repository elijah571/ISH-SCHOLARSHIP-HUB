import { sequelize } from '../index.js';
import { User } from './User.js';
import { UserSession } from './UserSession.js';
import { Scholarship } from './Scholarship.js';
import { UserSavedScholarship } from './UserSavedScholarship.js';
import { UserAppliedScholarship } from './UserAppliedScholarship.js';
import { Blog } from './Blog.js';
import { Internship } from './Internship.js';
import { Newsletter } from './Newsletter.js';
import { Activity } from './Activity.js';
import { Conversation } from './Conversation.js';
import { Message } from './Message.js';

// ─── User associations ─────────────────────────────────────────────────────
User.hasMany(UserSession, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' });
UserSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ─── Scholarship associations ──────────────────────────────────────────────
User.hasMany(Scholarship, { foreignKey: 'createdById', as: 'scholarshipsCreated' });
Scholarship.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

User.belongsToMany(Scholarship, {
  through: UserSavedScholarship,
  foreignKey: 'userId',
  otherKey: 'scholarshipId',
  as: 'savedScholarships',
});
Scholarship.belongsToMany(User, {
  through: UserSavedScholarship,
  foreignKey: 'scholarshipId',
  otherKey: 'userId',
  as: 'savedBy',
});

User.belongsToMany(Scholarship, {
  through: UserAppliedScholarship,
  foreignKey: 'userId',
  otherKey: 'scholarshipId',
  as: 'appliedScholarships',
});
Scholarship.belongsToMany(User, {
  through: UserAppliedScholarship,
  foreignKey: 'scholarshipId',
  otherKey: 'userId',
  as: 'appliedBy',
});

UserSavedScholarship.belongsTo(User, { foreignKey: 'userId' });
UserSavedScholarship.belongsTo(Scholarship, { foreignKey: 'scholarshipId' });
UserAppliedScholarship.belongsTo(User, { foreignKey: 'userId' });
UserAppliedScholarship.belongsTo(Scholarship, { foreignKey: 'scholarshipId' });

// ─── Blog associations ────────────────────────────────────────────────────
User.hasMany(Blog, { foreignKey: 'createdById', as: 'blogsCreated' });
Blog.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ─── Internship associations ──────────────────────────────────────────────
User.hasMany(Internship, { foreignKey: 'createdById', as: 'internshipsCreated' });
Internship.belongsTo(User, { foreignKey: 'createdById', as: 'createdBy' });

// ─── Activity associations ────────────────────────────────────────────────
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ─── Chat associations ─────────────────────────────────────────────────────
User.hasMany(Conversation, { foreignKey: 'participantId', as: 'participantConversations' });
User.hasMany(Conversation, { foreignKey: 'adminId', as: 'adminConversations' });
Conversation.belongsTo(User, { foreignKey: 'participantId', as: 'participant' });
Conversation.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'messagesSent' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

export {
  sequelize,
  User,
  UserSession,
  Scholarship,
  UserSavedScholarship,
  UserAppliedScholarship,
  Blog,
  Internship,
  Newsletter,
  Activity,
  Conversation,
  Message,
};

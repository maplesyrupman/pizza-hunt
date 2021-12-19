const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const replySchema = new Schema({
  replyId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId()
  },
  replyBody: {
    type: String,
    required: 'Reply body cannot be blank',
    trim: true
  },
  writtenBy: {
    type: String,
    required: 'Written by cannot be empty',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  }
},
{
  toJSON: {
    getters: true
  }
})

const CommentSchema = new Schema({
  writtenBy: {
    type: String,
    required: 'You must provide an author',
    trim: true
  },
  commentBody: {
    type: String,
    required: 'Comment cannot be empty',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: createdAtVal => dateFormat(createdAtVal)
  },
  replies: [replySchema]
},
{
  toJSON: {
    getters: true,
    virtuals: true
  },
  id: false
});

CommentSchema.virtual('replyCount').get(function() {return this.replies.length})

const Comment = model('Comment', CommentSchema);

module.exports = Comment;

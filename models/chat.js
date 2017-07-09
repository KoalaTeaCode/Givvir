var mongoose = require('mongoose');

var ChatMessageSchema = new mongoose.Schema({
  userId: String,
  toId: String,
  type: String,
  message: String,
  createdAt: { type: Date },
  updateAt: { type: Date }
});

ChatMessageSchema.pre('save', function(next){
  now = new Date();
  this.updateAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);

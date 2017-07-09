var mongoose = require('mongoose');

var MembersSchema = new mongoose.Schema({
  userId: String,
  groupOpId: String,
  type: String,
  beenInvited: Boolean,
  inviteAccepted: Boolean,
  signedUp: Boolean,
  participated: Boolean,
  userWhoConfirmedParticipation: String,
  hoursCompleted: Number,
  left: Boolean,
  removed: Boolean,
  createdAt: { type: Date },
  updateAt: { type: Date }
});

MembersSchema.pre('save', function(next){
  now = new Date();
  this.updateAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Members', MembersSchema);

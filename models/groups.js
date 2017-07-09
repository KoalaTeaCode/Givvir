var mongoose = require('mongoose');

var GroupsSchema = new mongoose.Schema({
  title: String,
  userId: String,
  privacy: String,
  createdAt: { type: Date },
  updateAt: { type: Date }
});

GroupsSchema.pre('save', function(next){
  now = new Date();
  this.updateAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Groups', GroupsSchema);

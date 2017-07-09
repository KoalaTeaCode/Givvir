var mongoose = require('mongoose');

var OpportunitiesSchema = new mongoose.Schema({
  title: String,
  location: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  categories: Array,
  privacy: { type: String, default: "public" },
  createdAt: { type: Date },
  updateAt: { type: Date },
  groupOpId: String,
  userId: String
});

OpportunitiesSchema.pre('save', function(next){
  now = new Date();
  this.updateAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Opportunities', OpportunitiesSchema);

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
   
  },
  slug: {
    type: String,
    
  },
  status: {
    type: String,
    default: 'Active',
  },
});

module.exports = mongoose.model('Category', categorySchema);

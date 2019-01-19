var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var newsSchema = new Schema({
	'title' : String,
	'link' : String
});

module.exports = mongoose.model('news', newsSchema);

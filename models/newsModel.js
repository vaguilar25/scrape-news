var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var newsSchema = new Schema({
	'title' : String,
	'link' : String,
	'summary' : String,
	'saved' : Boolean,
	'notes' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'Note'
	}
});

module.exports = mongoose.model('news', newsSchema);

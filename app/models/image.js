var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({

	path: String,
	attachedTo: mongoose.Schema.Types.ObjectId,
	attachmentTime: String

});

module.exports = mongoose.model('Image', imageSchema);

var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({

	description: String,
	quiz: mongoose.Schema.Types.ObjectId,
	choices: [{
		value: String,
		description: String
	}]

});

module.exports = mongoose.model('Question', questionSchema);

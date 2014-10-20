var app = window.app || {};

app.QuizCreator = app.QuizCreator || {

	quizData: {},

	init: function() {

		// Add a new Question
		$('#addQuestionButton').click(function(){

			// TODO:
			// Add a new question thumbnail to navigator
			// Add new question form markup to page

		});

		// TODO: Add/Edit an Image
		$('.editor-panel-editor .image-preview > a').click(function(){

		});

		// TODO: Add a result
		$('#addResultButton').click(function(){

		});

		// Switch Slides
		$('.editor-panel-slides .slides li:not(#addQuestionButton)').click(function(){

			// Check if element is Add New Button - handled elsewhere
			// if ($(this).is('#addQuestionButton')) return false;

			// Update Currently Active Slide in Sidebar
			$('.editor-panel-slides .slides li.slide-active').removeClass('slide-active');
			$(this).addClass('slide-active');

			// FIXME: Change view to corresponding view type
			var newSlideIndex = $(this).index();
			$('.editor-panel-editor .editor-active').removeClass('editor-active');
			$('.editor-panel-editor').children().eq(newSlideIndex).addClass('editor-active');

			// TODO: Populate view with relevant details (if necessary?)

		});

	},

	getNumQuestions: function() {
		return $('#numQuestions').attr('value');
	},

	getNumResults: function() {
		return $('#numResults').attr('value');
	},

	addQuestion: function() {
		// Increment Hidden Field Count
		var qid = parseInt(this.getNumQuestions()) + 1;
		$('#numQuestions').attr('value', qid);

		//TODO: add the markup
		var questionMarkup = '<div class="question"><div class="form-group"><label for="quizQuestion' + qid + '">Question</label><input type="text" class="form-control" id="quizQuestion' + qid + '" name="quizQuestion' + qid + '" placeholder="Question Text..."></div><div class="question-answers"><div class="row"><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">A</span><input type="text" class="form-control" id="quizQuestion' + qid + '-a" name="quizQuestion' + qid + '-a" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">B</span><input type="text" class="form-control" id="quizQuestion' + qid + '-b" name="quizQuestion' + qid + '-b" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">C</span><input type="text" class="form-control" id="quizQuestion' + qid + '-c" name="quizQuestion' + qid + '-c" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">D</span><input type="text" class="form-control" id="quizQuestion' + qid + '-d" name="quizQuestion' + qid + '-d" placeholder="Answer..."/></div></div></div></div></div>';
		$('#addQuestionButton').before(questionMarkup);
	},

	addResult: function() {
		// Increment Hidden Field Count
		var rid = parseInt(this.getNumResults()) + 1;
		$('#numResults').attr('value', rid);

		//TODO: add the markup
		var resultMarkup = '<div class="result"><div class="row"><div class="form-group col-md-8"><label for="quizResult' + rid + '">Result Title</label><input type="text" class="form-control" id="quizResult' + rid + '" name="quizResult' + rid + '" placeholder="Result Title..."/></div><div class="form-group col-md-4"><label for="quizResult' + rid + '-value">Corresponding Answer</label><select class="form-control" id="quizResult' + rid + '-value" name="quizResult' + rid + '-value"><option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select></div></div><div class="form-group"><label for="quizResult' + rid + '-description">Description</label><textarea class="form-control" id="quizResult' + rid + '-description" name="quizResult' + rid + '-description" placeholder="Result Description..."></textarea></div></div>';
		$('#addResultButton').before(resultMarkup);
	},

	updateView: function() {

	},

	saveQuiz: function() {

	}

};

app.QuizCreator.init();

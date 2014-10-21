var app = window.app || {};

app.QuizCreator = app.QuizCreator || {

	quizData: app.Quiz ? app.Quiz.init() : {questions:[{choices:[{}]}], results:[{}]},

	getParentIndex: function(elem, parentSelector) {
		var container = $(elem).parents(parentSelector).first(),
			index = $(container).parent().children(parentSelector).index(container);
		return index;
	},

	questionChanged: function(elem, property, value) {
		var questionIndex = this.getParentIndex(elem, '.editor-question'),
			isChoice = $(elem).parents('.question-answers').length > 0;

		if (isChoice) {
			var choiceIndex = $(elem).parents('.form-group').index(),
				choiceValue = $(elem).data('value');
			this.quizData.questions[questionIndex].choices[choiceIndex] = this.quizData.questions[questionIndex].choices[choiceIndex] || {};
			this.quizData.questions[questionIndex].choices[choiceIndex][property] = value;
			this.quizData.questions[questionIndex].choices[choiceIndex]['value'] = choiceValue;
		} else {
			this.quizData.questions[questionIndex][property] = value;
		}
	},

	resultChanged: function(elem, property, value) {
		var resultIndex = this.getParentIndex(elem, '.result');
		this.quizData.results[resultIndex][property] = value;
	},

	detailChanged: function(e) {
		var elem = e.currentTarget,
			property = $(elem).data('property'),
			value = $(elem).val(),
			parentObjectContainer = $(elem).parents('section > div').first();

		var isQuizSetting = $(parentObjectContainer).hasClass('editor-landing'),
			isQuestionDetail = $(parentObjectContainer).hasClass('editor-question'),
			isResult = $(parentObjectContainer).hasClass('editor-results');

		if (isQuizSetting) {
			this.quizData[property] = value;
		} else if (isQuestionDetail) {
			this.questionChanged(elem, property, value);
		} else if (isResult) {
			this.resultChanged(elem, property, value);
		}

	},

	init: function(quizData) {

		if (quizData)
			this.quizData = quizData;

		$('.editor-panel-editor').on('change', 'textarea, input:not(.image), select', this.detailChanged.bind(this));

		// Add a new Question
		$('#addQuestionButton').click(function(){

			// Add an empty question object to quizData
			// Add a new question thumbnail to navigator
			// Add new question form markup to page
			app.QuizCreator.quizData.questions.push({});
			app.QuizCreator.addQuestionMarkup();

		});

		// TODO: Add/Edit an Image
		$('.editor-panel-editor').on('change', 'input.image', function(e){
			if (this.checkValidity()) {
				
				var imgUrl = $(this).val(),
					image = $(this).parents('.image-preview').find('img');
				if (!image.length) {
					image = document.createElement('img');
				}
				$(image).attr('src', imgUrl);
				$(this).parents('.image-preview').prepend(image);
				
				// FIXME: Update thumbnail
				var qIndex = $(this).parents('div:not(.form-group)').first().index();
				$('.editor-panel-slides .slides .questions li').children().eq(qIndex-1).css('background-image', 'url(' + imgUrl + ')');

				// TODO: create image object, store to be saved on server once quiz is saved
			}
		});

		// TODO: Add a result
		$('#addResultButton').click(function(){

		});

		// Switch Slides
		$('.editor-panel-slides .slides').on('click', 'li:not(#addQuestionButton)', function(){

			// Check if element is Add New Button - handled elsewhere
			// if ($(this).is('#addQuestionButton')) return false;

			// Update Currently Active Slide in Sidebar
			$('.editor-panel-slides .slides li.slide-active').removeClass('slide-active');
			$(this).addClass('slide-active');

			// Change view to corresponding view type
			var newSlideIndex = $(this).parents('.slides').find('li').index(this);
			$('.editor-panel-editor .editor-active').removeClass('editor-active');
			$('.editor-panel-editor').children('div').eq(newSlideIndex).addClass('editor-active');

			// TODO: Populate view with relevant details (if necessary?)

		});

		// Save Quiz
		$('#saveQuizButton').click(this.saveQuiz.bind(this));

	},

	addQuestionMarkup: function(question) {
		var thumbMarkup = '<li class="slide slide-question"><div class="thumb"><span>Quiz Question</span></div></li>',
			editorMarkup = '<div class="editor-question container" data-question-index="0"><div class="form-group"><label for="quizQuestion1">Question</label><input type="text" data-property="title" class="form-control" id="quizQuestion1" name="quizQuestion1" placeholder="Question Text..."></div><div class="question-answers row"><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">A</span><input type="text" data-property="a" class="form-control" id="quizQuestion1-a" name="quizQuestion1-a" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">B</span><input type="text" data-property="b" class="form-control" id="quizQuestion1-b" name="quizQuestion1-b" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">C</span><input type="text" data-property="c" class="form-control" id="quizQuestion1-c" name="quizQuestion1-c" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">D</span><input type="text" data-property="d" class="form-control" id="quizQuestion1-d" name="quizQuestion1-d" placeholder="Answer..."/></div></div></div><div class="image-preview well"><div class="form-group"><label for="quizQuestion1-image">Add Question Image</label><input type="url" data-property="image" class="form-control image" id="quizQuestion1-image" name="quizQuestion1-image" placeholder="http://www.example.com/link/to/your/image"/></div></div></div>';

		// TODO: insert question info if provided
		if (question) {
		}

		$('.editor-panel-slides .slide-question').last().after(thumbMarkup);
		$('.editor-panel-editor .editor-question').last().after(editorMarkup);

	},

	saveQuiz: function() {
		$.ajax({
			type: 'POST',
			url: '/api/new/quiz',
			contentType: "application/json",
			data: JSON.stringify(this.quizData),
			dataType: 'json',
			success: function(data) {
				console.log(data);
			},
			complete: function(data) {
				console.log(data);
			}
		});
	}

};

app.QuizCreator.init();

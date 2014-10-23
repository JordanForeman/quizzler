var app = window.app || {};

app.QuizCreator = app.QuizCreator || {

	quizData: app.Quiz ? app.Quiz.init() : {questions:[{choices:[{}]}], results:[{}]},

	init: function(quizData) {

		if (quizData)
			this.quizData = quizData;

		this.addHandlers();
		this.loadCKEditor();

	},

	//----------
	// Utilities
	//----------
	addHandlers: function() {
		// Update Quiz Data on Input Change
		$('.editor-panel-editor').on('change', 'textarea, input:not(.image), .editor-results select', this.detailChanged.bind(this));

		// Add a new Question
		$('#addQuestionButton').click(this.addQuestion.bind(this));

		// TODO: Add/Edit an Image
		$('.editor-panel-editor').on('change', 'input.image', this.updateImage.bind(this));

		// Add a result
		$('#addResultButton').click(this.addResult.bind(this));

		// Switch Slides
		$('.editor-panel-slides .slides').on('click', 'li:not(#addQuestionButton)', this.switchSlides.bind(this));

		// Update Scoring Model
		$('.editor-landing').on('change', 'select', this.changeScoringModel.bind(this));

		// Save Quiz
		$('#saveQuizButton').click(this.saveQuiz.bind(this));
	},

	loadCKEditor: function() {
		if (!window.CKEDITOR)
			return false; // Load CKEditor yo!

		$('textarea').ckeditor();
		for (var i in CKEDITOR.instances) {
			CKEDITOR.instances[i].on('change', this.ckeditorChanged.bind(this));
		}
	},

	getParentIndex: function(elem, parentSelector) {
		var container = $(elem).parents(parentSelector).first(),
			index = $(container).parent().children(parentSelector).index(container);
		return index;
	},

	ckeditorChanged: function(event) {
		var editor = event.editor;

		if (!editor)
			return false;

		var newValue = editor.getData(),
			isQuestionDescription = $(editor.element.$).parents('.editor-active').hasClass('editor-landing');

		if (isQuestionDescription) {
			this.quizData.description = newValue;
			return;
		}

		// If we make it this far, we're a result
		var resultIndex = this.getParentIndex(editor.element.$, '.result');
		this.quizData.results[resultIndex].description = newValue;
		return;
	},

	questionChanged: function(elem, property, value) {
		var questionIndex = this.getParentIndex(elem, '.editor-question'),
			isChoice = $(elem).parents('.question-answers').length > 0;

		if (isChoice) {
			var choiceIndex = $(elem).parents('.form-group').index();

			this.quizData.questions[questionIndex].choices[choiceIndex] = this.quizData.questions[questionIndex].choices[choiceIndex] || {value: $(elem).data('value')};
			this.quizData.questions[questionIndex].choices[choiceIndex][property] = value;
		} else {
			this.quizData.questions[questionIndex][property] = value;
		}
	},

	resultChanged: function(elem, property, value) {
		var resultIndex = this.getParentIndex(elem, '.result');
		this.quizData.results[resultIndex][property] = value;
	},

	addQuestionMarkup: function(question) {
		var thumbMarkup = '<li class="slide slide-question"><div class="thumb"><span>Quiz Question</span></div></li>',
			editorMarkup = '<div class="editor-question container" data-question-index="0"><div class="form-group"><label for="quizQuestion1">Question</label><input type="text" data-property="title" class="form-control" id="quizQuestion1" name="quizQuestion1" placeholder="Question Text..."></div><div class="question-answers row"><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">A</span><input type="text" data-property="description" data-value="a" class="form-control" id="quizQuestion1-a" name="quizQuestion1-a" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">B</span><input type="text" data-property="description" data-value="b" class="form-control" id="quizQuestion1-b" name="quizQuestion1-b" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">C</span><input type="text" data-property="description" data-value="c" class="form-control" id="quizQuestion1-c" name="quizQuestion1-c" placeholder="Answer..."/></div></div><div class="form-group col-md-3"><div class="input-group"><span class="input-group-addon">D</span><input type="text" data-property="description" data-value="d" class="form-control" id="quizQuestion1-d" name="quizQuestion1-d" placeholder="Answer..."/></div></div></div><div class="image-preview well"><div class="form-group"><label for="quizQuestion1-image">Add Question Image</label><input type="url" data-property="image" class="form-control image" id="quizQuestion1-image" name="quizQuestion1-image" placeholder="http://www.example.com/link/to/your/image"/></div></div></div>';
			
		// TODO: insert question info if provided
		if (question) {
		}

		$('.editor-panel-slides .slide-question').last().after(thumbMarkup);
		$('.editor-panel-editor .editor-question').last().after(editorMarkup);

	},

	//---------------
	// Event Handlers
	//---------------
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

	addQuestion: function(event) {
		// Add an empty question object to quizData
		// Add a new question thumbnail to navigator
		// Add new question form markup to page
		this.quizData.questions.push({choices:[]});
		this.addQuestionMarkup();
	},

	updateImage: function(event) {
		var targetElem = event.currentTarget,
			editorContainer = $(targetElem).parents('.editor-active');
		
		if (!editorContainer.length || !targetElem.checkValidity())
			return false; // FIXME: handle error more gracefully
		
		// Update Image Preview
		var imgUrl = $(targetElem).val(),
			image = $(targetElem).parents('.image-preview').find('img');
		if (!image.length) {
			image = document.createElement('img');
		}
		$(image).attr('src', imgUrl);
		$(targetElem).parents('.image-preview').prepend(image);

		// Update Data Model
		if ($(editorContainer).hasClass('editor-landing')) 
		{
			this.quizData['image'] = imgUrl;
		}
		else if ($(editorContainer).hasClass('editor-question')) 
		{
			var questionIndex = this.getParentIndex(targetElem, '.editor-question');
			this.quizData.questions[questionIndex]['image'] = imgUrl;

			// Update Thumbnail
			var qIndex = this.getParentIndex(editorContainer, 'editor-question');
			$('.editor-panel-slides .slides .questions li').children().eq(qIndex).css('background-image', 'url(' + imgUrl + ')');
		} 
		else if ($(editorContainer).hasClass('editor-results')) 
		{
			var resultIndex = this.getParentIndex(targetElem, '.result');
			this.quizData.results[resultIndex]['image'] = imgUrl;
		}

	},

	addCKEditEvent: function(editor) {
		$(editor).on('change', this.ckeditorChanged.bind(this));
	},

	addResult: function(event) {
			var targetElem = $(event.currentTarget),
				resultFormMarkup = '<hr /><div class="result"><div class="row"><div class="form-group col-md-8"><label for="quizResult1">Result Title</label><input type="text" data-property="title" class="form-control" id="quizResult1" name="quizResult1" placeholder="Result Title..."/></div><div class="form-group col-md-4"><label for="quizResult1-value">Corresponding Answer</label><select class="form-control" data-property="value" id="quizResult1-value" name="quizResult1-value"><option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select></div></div><div class="image-preview well"><div class="form-group"><label for="quizResult1-image">Add Result Image</label><input type="url" data-property="image" class="form-control image" id="quizResult1-image" name="quizResult1-image" placeholder="http://www.example.com/link/to/your/image"/></div></div><div class="form-group"><label for="quizResult1-description">Description</label><textarea class="form-control" data-property="description" id="quizResult1-description" name="quizResult1-description" placeholder="Result Description..."></textarea></div></div>';
			
			$(targetElem).parent('.editor-results').append(resultFormMarkup);

			var editor = $(targetElem).siblings('.result:last').find('textarea');
			$(editor).ckeditor(this.addCKEditEvent(editor));

			var defaultValue = null;
			switch (this.quizData.scoringModel) {
				case 'mostcommon':
					defaultValue = "a";
					break;
				case 'sumrange':
					defaultValue = 0;
					break;
				default:
					break;
			}

			this.quizData.results.push({value: defaultValue});
	},

	switchSlides: function(event) {
			var targetElem = $(event.currentTarget);

			// Check if element is Add New Button - handled elsewhere
			// if ($(this).is('#addQuestionButton')) return false;

			// Update Currently Active Slide in Sidebar
			$('.editor-panel-slides .slides li.slide-active').removeClass('slide-active');
			$(targetElem).addClass('slide-active');

			// Change view to corresponding view type
			var newSlideIndex = $(targetElem).parents('.slides').find('li').index(targetElem);
			$('.editor-panel-editor .editor-active').removeClass('editor-active');
			$('.editor-panel-editor').children('div').eq(newSlideIndex).addClass('editor-active');

			// TODO: Populate view with relevant details (if necessary?)

	},

	changeScoringModel: function(event) {
		var newScoringModel = $(event.currentTarget).val();
		this.quizData['scoringModel'] = newScoringModel;

		//TODO: update question/result forms
	},

	saveQuiz: function() {
		$.ajax({
			type: 'POST',
			url: '/api/new/quiz',
			contentType: "application/json",
			data: JSON.stringify(this.quizData),
			dataType: 'json',
			success: function(data) {
				var quizId = data.quiz._id;
				console.log(quizId);
			},
			complete: function(data) {
				console.log(data);
			}
		});
	}

};

app.QuizCreator.init();

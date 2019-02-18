let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

///////////////////
// Configuration //
///////////////////

// Video player dimensions
let playerWidth = 640;
let playerHeight = 390;

let player; // Controls youtube player w/ youtube api
let currentQuestion = -1; //index of which question is currently displayed
let pausedForQuestion = false; //whether video is paused while student answers question

// Fires when youtube player has loaded video
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: playerHeight,
		width: playerWidth,
		videoId: 'yZYjgVphAV0',
		host: 'https://www.youtube.com',
		origin: 'https://tools-for-online-learning.github.io/toaster-guided-discovery/',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

// Plays video once API has loaded
function onPlayerReady(event){
	event.target.playVideo();
}


// Fires when video begins/pauses
	// Used to pause video at specified time(s)
function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.PLAYING) {
		if (currentQuestion < questions.length - 1) {
			currentQuestion++;
			var delayTime;
			setTimeout(setQuestion, questions[currentQuestion].delay * 1000, currentQuestion, questions);
		}
	}
}

function pauseVideo() {
	player.pauseVideo();
}

// Timing and answers of a question
	// Question text is not stored b/c it is displayed in video
	// Includes render method
function Question(delay, answers) {
	this.delay = delay;
	this.answers = answers;
	var self = this;

	// Show the video on screen
		// Question repeat is a boolean to track if we are repeating the question
		// Only animate overlay if we are not repeating the question (since overlay is already present)
	this.render = function(question_repeat) {
		console.log("rendering question");
		if (!question_repeat) {
			console.log("question is not repeat; animating");
			$('#answers').hide(); // Hide container with answers & feedback
		}
		$('.answersRow').empty(); // Clear old answers
		
		// Add overlay to video
		$('<div/>', {
			id: "overlay",
		}).appendTo('#answers');

		// Render each answer individually
		self.answers.forEach((answer, i) => {
			var parent = "#answersRowOne"; // First two answers go in first row
			if (i > 1) {
				parent = "#answersRowTwo" // Second two answers go in second row
			}
			answer.render(parent);
		});
		if (!question_repeat) {
			$('#answers').show(500); // Reveal answers
		}

	}
}

// One answer to a given question, whether it's correct, and the feedback to give
	// Includes methods for rendering on screen, and handling clicks
function Answer(text, correct, feedback) {
	this.text = text;
	this.correct = correct;
	this.feedback = feedback;
	var self = this;

	// Add the answer to the DOM
	this.render = function(parent) {
		$('<div/>', {
			class: "answer",
			text: self.text
		})
		.on('click', self.respondToAnswer) // click handler to display feedback
		.appendTo(parent); // insert in either #answersRowOne or #answersRowTwo
	}

	// When answer is clicked, show feedback
	this.respondToAnswer = function() {
		$('.answersRow').empty();
		$('<div/>', {
			class: "answer",
			text: self.feedback
		})
		.on('click', self.finishFeedback) // click handler when feedback is pressed
		.appendTo('#answersRowOne');
	}

	// When feedback is clicked, proceed or repeat question
	this.finishFeedback = function() {
		console.log("finishing feedback");
		$('.answersRow').empty();
		if (self.correct) {
			$('#answers').hide(500, _ => {
				$('#overlay').remove();
				player.playVideo();
			});
		} else {
			$('#overlay').remove();
			questions[currentQuestion].render(true);
		}
	}
}

// Pause video and display the selected question
function setQuestion(index, questions) {
	player.pauseVideo();
	question = questions[index];
	let parent = "#answersRowOne";
	question.render(false);
}

///////////////
// Instances //
///////////////

// pause at 42s
let q0 = new Question(42, [new Answer("Made your guess? Click here", true, "Nice! Click to continue")]);
// pause at 58s
let q1 = new Question(16, [new Answer("Radient heat from an electrified wire", true, "You got it!"), new Answer("Direct heat from an electrified wire", false, "Nice Try")]);
// pause at 1:33
let q2 = new Question(35, [new Answer("A spring holds the toast in place and a magnet pops the toast up", false, "Good try, but not quite."), new Answer("A spring holds the toast in place and another spring pops the toast up", false, "Close! You're right about how the toast pops up"), new Answer("A magnet holds the toast in place and a spring pops the toast up", true, "Very good!"), new Answer("A magnet holds the toast in place and another magnet pops the toast up", false, "Almost! You're right about how the toast is held in place")]);
// pause at 2:52
let q3 = new Question(79, [new Answer("The cage radiates cold", false, "Cold can't actually be 'made', but heat can be removed"), new Answer("The cage blocks parts of the toast from getting radient heat", true, "Great job!")]);
// pause at 3:38
let q4 = new Question(46, [new Answer("The cage is electrified like the wires", false, "It would be dangerous to electrify the cage!"), new Answer("The cage absorbs radient heat from the wire and conducts it into the toast", true, "Toast-tastic!")]);

let questions = [q0, q1, q2, q3, q4];
	

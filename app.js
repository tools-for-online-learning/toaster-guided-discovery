let tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";

firstScriptTag = document.getElementsByTagName('script')[0];
console.log(firstScriptTag);
console.log(firstScriptTag.parentNode);
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: 'WYcw_DcZsak',
		host: 'https://www.youtube.com',
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	console.log("API is ready:");
	console.log(player);
}

// Plays video once API has loaded
function onPlayerReady(event){
	// alert("Player is ready!");
	console.log("player is ready");
	event.target.playVideo();
}


let done = false;
// Fires when video begins/pauses
	// Used to pause video at specified time(s)
function onPlayerStateChange(event) {
	console.log("State change");
	if (event.data == YT.PlayerState.PLAYING && !done) {
		setTimeout(pauseVideo, 5000);
		done = true;
	}
}

function pauseVideo() {
	player.pauseVideo();
}

	

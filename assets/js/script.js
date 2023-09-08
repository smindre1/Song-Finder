// MusixMatch API variables
var apiKey = "dd42b88bfa80efe12d3872472298e2c5";
var lyricToSearch = "";

var apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(
  lyricToSearch
)}&apikey=${apiKey}`;

var resultsContainer = document.getElementById("musixmatch-results");
var searchButton = document.getElementById("search-button");

console.log("script.js has finished running");

searchButton.addEventListener("click", function () {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.message.body.track_list);
      console.log(data);
    });

  var lyricToSearch = document.getElementById("query").value;
  apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
  resultsContainer.innerHTML = "";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayResults(data.message.body.track_list);
    });

  console.log("searchButton Clicked!");
});

// function displayResults(playList) {
//   playList.forEach((play) => {
//     var artistName = play.track.artist_name;
//     var trackName = play.track.track_name;

//     var playElement = document.createElement("div");
//     playElement.innerHTML = `<p>${trackName} by ${artistName}</p>`;

//     resultsContainer.appendChild(playElement);
//   });

function displayResults(playList) {
  for (i = 0; i < playList.length; i++) {
    var btnIdentifier = "button-" + String(i);

    var artistName = playList[i].track.artist_name;
    var trackName = playList[i].track.track_name;
    console.log(btnIdentifier, "btn Identifier");
    //attr add button class
    var playElement = $("<button></button>").attr("id", btnIdentifier);
    playElement.attr("artistName", `${artistName}`);

    playElement.html(`<p>${trackName} by ${artistName}</p>`);
    $("#musixmatch-results").append(playElement);
    $("#" + btnIdentifier).on("click", spotifyAPISearch);
  }
}

function spotifyAPISearch(event) {
  // console.log(event.target.id);
  console.log($(this).attr("artistName"));
}
// for(i=0; i<10; i++){

// var btnIdentifier = "button-" + String(i);
// var result = $("#musixmatch-results").appendTo("<button></button>").attr("id", btnIdentifier);
// result.html("Song Title: " + songTitle + " " + "Artist: " + artistName)
// };
// btnEventListeners()
// })

// function btnEventListeners() {
// for(i=0; i<10; i++){
// var btnId = "#button-" + i;
// $(btnId).click(spotifyAPISearch)
// }};

// function spotifyAPISearch() {
//
// }

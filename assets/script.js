
var apiKey = 'dd42b88bfa80efe12d3872472298e2c5'; 
var lyricToSearch = ''; 
var apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;

var resultsContainer = document.getElementById('results');
var searchButton = document.getElementById('searchButton');




fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    displayResults(data.message.body.track_list);
    console.log(data);
  })

console.log("script.js has finished running");

function myFunction(res) {
  console.log("I'm runnin inside myFunction", res);
}

myFunction("I am a response!");

searchButton.addEventListener('click', function(){
    var lyricToSearch = document.getElementById('searchInput').value;
    apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
    resultsContainer.innerHTML = '';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayResults(data.message.body.track_list);
        })

    console.log('searchButton Clicked!');
})

function displayResults(playList){
    playList.forEach(play => {
        var trackName = play.track.track_name;
        var artistName = play.track.artist_name;

        var playElement = document.createElement('div');
        playElement.innerHTML = `<p>${trackName} by ${artistName}</p>`;

        resultsContainer.appendChild(playElement);
    })
}

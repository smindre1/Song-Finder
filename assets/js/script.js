// MusixMatch API Variables
var apiKey = "dd42b88bfa80efe12d3872472298e2c5";
var lyricToSearch = "";

var apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(
  lyricToSearch
)}&apikey=${apiKey}`;

var resultsContainer = document.getElementById("musixmatch-results");
var searchButton = document.getElementById("search-button");

// Spotify API Variables
var my_clientID = "6b436b1d69fb4fd4b9257fb9c76549f7";
var clientSecret = "211deb0626a845768b0b917dec296137";
var authorization = "Basic " + buffer.Buffer.from(my_clientID + ":" + clientSecret).toString("base64");
let myHeaders = new Headers();
// myHeaders.append("Authorization", `Basic ${my_clientID}:${clientSecret}`);
myHeaders.append("Authorization", authorization);
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: urlencoded,
  redirect: "follow",
  client_id: my_clientID,
  client_secret: clientSecret,
  grant_type: "client_credentials",
};
////////////

// console.log("script.js has finished running");

searchButton.addEventListener("click", function () {
  console.log("thing");
  fetch(apiUrl).then((response) => response.json());
  // .then((data) => {
  //   // displayResults(data.message.body.track_list);
  //   console.log(data);
  // });

  var lyricToSearch = document.getElementById("query").value;
  apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
  resultsContainer.innerHTML = "";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayResults(data.message.body.track_list);
    });

  // console.log("searchButton Clicked!");
});

function displayResults(playList) {
  for (i = 0; i < playList.length; i++) {
    var btnIdentifier = "button-" + String(i);

    var artistName = playList[i].track.artist_name;
    var trackName = playList[i].track.track_name;
    // console.log(btnIdentifier, "btn Identifier");
    //attr add button class
    var playElement = $("<button></button>").attr("id", btnIdentifier);
    playElement.attr("artistName", `${artistName}`);

    playElement.html(`<p>${trackName} by ${artistName}</p>`);
    $("#musixmatch-results").append(playElement);
    $("#" + btnIdentifier).on("click", spotifyAPISearch);
  }
}

function spotifyAPISearch(event) {
  console.log("repeat");
  var musixMatchArtist = $(this).attr("artistName");
  //check artist name for spaces and replace them with '+'
  if (musixMatchArtist.includes(" ") === true) {
    musixMatchArtist = musixMatchArtist.replaceAll(" ", "+");
  }

  //Spotify API fetch
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(function (res) {
      // console.log(res);
      console.log("repeat 2");
      return res.json();
    })
    .then(function (res) {
      console.log("repeat 3");
      // res = res.json();
      console.log(res, res.access_token, "test one");
      var access_token = res.access_token;

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      // var fetchUrl = "https://api.spotify.com/v1/search?q=artist%3A" + musixMatchArtist + "&type=artist";
      var fetchUrl = "https://api.spotify.com/v1/search?q=" + musixMatchArtist + "&type=artist";
      String(fetchUrl);
      return fetch(fetchUrl, requestOptions);
    })
    .then(function (res) {
      // console.log(res, "res");
      return res.json();
    })

    .then(function (res) {
      console.log(res);
      var artistFollowers = [];
      var topResults = [];
      // console.log(res.artists, "items");
      // console.log(res.artists.items.length, "res.artists.items.length");

      for (i = 0; i < res.artists.items.length; i++) {
        var following = res.artists.items[i].followers.total;
        artistFollowers.push(following);
      }
      artistFollowers.sort(function (a, b) {
        return a - b;
      });
      // console.log(artistFollowers, "artistFollowers ordered test");
      for (i = artistFollowers.length - 1; i > artistFollowers.length - 4; i--) {
        for (x = 0; x < res.artists.items.length; x++) {
          if (artistFollowers[i] == res.artists.items[x].followers.total) {
            var data = [
              {
                name: res.artists.items[x].name,
                followerCount: artistFollowers[i],
                href: res.artists.items[x].external_urls.spotify,
                id: res.artists.items[x].id,
              },
            ];
            topResults.push(data);
          }
        }
      }
      console.log(topResults, "topResults");
      console.log(topResults[0], "i=0");
      console.log(topResults[0][0].name, "name");
      console.log(res, "test two");

      for (i = 0; i < topResults.length; i++) {
        var btnIdentifier = "spotifyButton-" + String(i);

        var artistName = topResults[i][0].name;
        var followerCount = topResults[i][0].followerCount;
        var externalLink = topResults[i][0].href;
        // console.log(btnIdentifier, "btn Identifier");
        //attr add button class
        var playElement = $("<button></button>").attr("id", btnIdentifier);
        playElement.attr("artistName", `${artistName}`);
        playElement.attr("externalLink", `${externalLink}`);

        playElement.html(`<p>Username: ${artistName} Followers: ${followerCount}</p>`);
        $("#spotify-results").append(playElement);
        $("#" + btnIdentifier).on("click", spotifyUser);
      }

      // fetch("https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=artist%3Abeyonce&type=artist", options).then(function (res) {
      //   console.log(res.json, "test 3");

      //   //   return res.json();
      // });
    });
}

function spotifyUser() {
  console.log("finished");
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

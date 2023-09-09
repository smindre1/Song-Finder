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

searchButton.addEventListener("click", function () {
  fetch(apiUrl).then((response) => response.json());

  var lyricToSearch = document.getElementById("query").value;
  apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
  resultsContainer.innerHTML = "";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayResults(data.message.body.track_list);
    });
});

function displayResults(playList) {
  // console.log(playList, "playList");
  for (i = 0; i < playList.length; i++) {
    var btnIdentifier = "button-" + String(i);

    var artistName = playList[i].track.artist_name;
    var trackName = playList[i].track.track_name;

    var playElement = $("<button></button>").attr("id", btnIdentifier);
    playElement.attr("artistName", `${artistName}`);
    playElement.attr("class", "musixMatchBtns");

    playElement.html(`<p>${trackName} by ${artistName}</p>`);
    $("#musixmatch-results").append(playElement);
    $("#" + btnIdentifier).on("click", spotifyAPISearch);
  }
}

function spotifyAPISearch(event) {
  $("#spotifyArtists").removeClass("displayNone");
  for (i = 0; i < 3; i++) {
    var container = "#spotifyArtists-" + String(i);
    var container2 = "#spotifyArtistsAlbums-" + String(i);
    $(container).empty();
    $(container2).empty();
  }
  // $("#spotify-results").empty();
  var musixMatchArtist = $(this).attr("artistName");
  //Checks the artist name for spaces and replaces them with '+'s
  if (musixMatchArtist.includes(" ") === true) {
    musixMatchArtist = musixMatchArtist.replaceAll(" ", "+");
  }

  //Spotify API fetch
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
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

      // Orders the spotify usernames by followers
      for (i = 0; i < res.artists.items.length; i++) {
        var following = res.artists.items[i].followers.total;
        artistFollowers.push(following);
      }
      artistFollowers.sort(function (a, b) {
        return a - b;
      });
      // Takes the top three spotify users with the highest follower counts and pushes it into 'topResults'
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
      // Creates the Spotify User buttons
      for (i = 0; i < topResults.length; i++) {
        var btnIdentifier = "playlistButton-" + String(i);
        var artistName = topResults[i][0].name;
        var followerCount = topResults[i][0].followerCount;
        var externalLink = topResults[i][0].href;
        var location = "#spotifyArtists-" + String(i);
        var albumLocation = "#spotifyArtistsAlbums-" + String(i);
        //attr add button class for css styling
        var playElement = $("<button></button>").attr("id", btnIdentifier);
        playElement.attr("artistName", `${artistName}`);
        playElement.attr("externalLink", `${externalLink}`);
        //Add details(albums) under each button
        var albums = playElement.html(`<p>Username: ${artistName} Followers: ${followerCount}</p>`);
        //Adds the button to the html
        $(location).append(playElement);
        $("#" + btnIdentifier).on("click", spotifyUser);

        // console.log(topResults[i][0].id, "topResults[i][0].id");
        spotifyPlaylist(i, topResults[i][0].id, albumLocation);
      }
    });
}

function spotifyUser(event) {
  // Need to make the external url lead to a new page.
  var externalLink = $(this).attr("externalLink");
  window.open(externalLink, "_blank");
  console.log("finished");
}

//////
//offer selected artists playlist
function spotifyPlaylist(instance, artistId, locationId) {
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      var access_token = res.access_token;

      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      var fetchUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
      String(fetchUrl);
      return fetch(fetchUrl, requestOptions);
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      /////
      var listId = "listId-" + String(instance);
      var list = $("<details><summary>User Albums</summary></details>").attr("id", listId);

      $(locationId).append(list);

      for (i = 0; i < res.items.length; i++) {
        var albumId = String(instance) + "-albumId-" + String(i);

        var playElement = $("<button></button>").attr("id", albumId);
        // playElement.attr("artistName", `${res.items[i].names}`);
        console.log(res.items[i].external_urls.spotify, "res.items[i].external_urls.spotify");
        playElement.attr("externalLink", `${res.items[i].external_urls.spotify}`);
        //Add details(albums) under each button
        var albums = playElement.html(
          `<p><b>Album Name:</b> ${res.items[i].name}</p><p><b>Album Type:</b> ${res.items[i].type}</p><p><b>Release Date:</b> ${res.items[i].release_date}</p>`
        );
        //Adds the button to the html
        $("#" + listId).append(albums);
        $("#" + albumId).on("click", spotifyUser);
      }
    });
}

// function resolveAfter2Seconds() { return new Promise((resolve) => { setTimeout(() => { resolve('resolved'); }, 2000); }); }

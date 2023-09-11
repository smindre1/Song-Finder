// MusixMatch API Variables
var apiKey = "dd42b88bfa80efe12d3872472298e2c5";
var resultsContainer = document.getElementById("musixmatch-results");
var searchButton = document.getElementById("search-button");

// Spotify API Variables
var my_clientID = "6b436b1d69fb4fd4b9257fb9c76549f7";
var clientSecret = "211deb0626a845768b0b917dec296137";
var authorization = "Basic " + buffer.Buffer.from(my_clientID + ":" + clientSecret).toString("base64");
let myHeaders = new Headers();
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
var lyricToSearch = document.getElementById("query").value;
apiUrl = `https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data, "data");
  });


//The search button event listener will fetch MusixMatch API data, and process that data with the displayResults function
searchButton.addEventListener("click", function () {
  var lyricToSearch = document.getElementById("query").value;
  //The herokuapp url was used to allow the api key to work on our local machine
  // apiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
  apiUrl = `https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(lyricToSearch)}&apikey=${apiKey}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data, "data");
      resultsContainer.innerHTML = "";
      displayResults(data.message.body.track_list);
    });
});

//This function creates a series of buttons for each song/artist that the MusixMatch API thinks is the closest to the user's inputted lyrics
function displayResults(playList) {
  for (i = 0; i < playList.length; i++) {
    //Creating and adding attribute identifiers with the data the buttons represent
    var btnIdentifier = "button-" + String(i);
    var artistName = playList[i].track.artist_name;
    var lyricId = playList[i].track.track_id;
    var trackName = playList[i].track.track_name;
    //Each button being assigned these attributes
    var playElement = $("<button></button>").attr({
      id: btnIdentifier,
      artistName: `${artistName}`,
      lyricId: `${lyricId}`,
      class: "musixMatchBtns",
    });
    //This is where each button is given unique text and is added into the html
    playElement.html(`<p>${trackName} by ${artistName}</p>`);
    $("#musixmatch-results").append(playElement);
    //Each button is given an event listener, which calls the spotifyAPISearch function when clicked
    $("#" + btnIdentifier).on("click", spotifyAPISearch);
  }
}

function spotifyAPISearch(event) {
  //API fetch request to MusixMatch for the lyrics of the clicked button and displays it in <aside id="lyrics">
  var lyricId = $(this).attr("lyricId");
  //The herokuapp url was used to allow the api key to work on our local machine
  // var lyricApiUrl = `https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${lyricId}&apikey=${apiKey}`;
  var lyricApiUrl = `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${lyricId}&apikey=${apiKey}`;
  fetch(lyricApiUrl)
    .then((response) => response.json())
    .then((data) => {
      $("#lyrics").empty();
      $("#aside").removeClass("displayNone");
      $("#lyrics").html(data.message.body.lyrics.lyrics_body);
    });
  //Reveals and empties any prior content in the Spotify artists section so that it can be filled in
  $("#spotifyArtists").removeClass("displayNone");
  for (i = 0; i < 3; i++) {
    var container = "#spotifyArtists-" + String(i);
    var container2 = "#spotifyArtistsAlbums-" + String(i);
    $(container).empty();
    $(container2).empty();
  }

  var musixMatchArtist = $(this).attr("artistName");
  //Checks the artist name for spaces and replaces them with '+'s for the 'fetchUrl'
  if (musixMatchArtist.includes(" ") === true) {
    musixMatchArtist = musixMatchArtist.replaceAll(" ", "+");
  }

  //Spotify API fetch request for Access Token which is needed for GET method fetch requests to Spotify
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then((res) => res.json())
    //Returns a fetch request for Spotify data on Usernames similar to the selected MusixMatch Artist
    .then(function (res) {
      var access_token = res.access_token;
      let myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${access_token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      var fetchUrl = "https://api.spotify.com/v1/search?q=" + musixMatchArtist + "&type=artist";
      String(fetchUrl);
      return fetch(fetchUrl, requestOptions);
    })
    .then((res) => res.json())
    //Orders the Spotify User data and grabs the three most likely to be the MusixMatch artist
    .then(function (res) {
      console.log(res, "res");
      var artistFollowers = [];
      var topResults = [];

      //Orders the spotify usernames by followers
      for (i = 0; i < res.artists.items.length; i++) {
        var following = res.artists.items[i].followers.total;
        artistFollowers.push(following);
      }
      artistFollowers.sort(function (a, b) {
        return a - b;
      });
      //Takes the top three spotify users with the highest follower counts and pushes it into 'topResults'
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
      // Creates the Spotify Artist buttons
      for (i = 0; i < topResults.length; i++) {
        var btnIdentifier = "playlistButton-" + String(i);
        var artistName = topResults[i][0].name;
        var followerCount = topResults[i][0].followerCount;
        var externalLink = topResults[i][0].href;
        var location = "#spotifyArtists-" + String(i);
        var albumLocation = "#spotifyArtistsAlbums-" + String(i);
        var playElement = $("<button></button>").attr({
          id: btnIdentifier,
          artistName: `${artistName}`,
          externalLink: `${externalLink}`,
          class: "spotifyUserButtons",
        });
        playElement.html(`<p>Username: ${artistName} Followers: ${followerCount}</p>`);
        //Adds the button to the html
        $(location).append(playElement);
        $("#" + btnIdentifier).on("click", openNewWindow);
        //Adds the <details> tag, each with their own list of albums, under each Spotify Artist button
        spotifyPlaylist(i, topResults[i][0].id, albumLocation);
      }
    });
}

//Offers selected artist's album playlist
function spotifyPlaylist(instance, artistId, locationId) {
  var fetchUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then((res) => res.json())
    //Obtains Spotify access token and fetches the album data for a Spotify Artist
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
    .then((res) => res.json())
    .then(function (res) {
      //Creates and adds the <details> tag that contains a Spotify Artist's album list
      var listId = "listId-" + String(instance);
      var list = $("<details><summary>User Albums</summary></details>").attr({ id: listId, class: "spotifyArtistPlaylist" });
      $(locationId).append(list);
      //Creates and adds each of the Spotify Artist's albums to the <details> tag as a button
      for (i = 0; i < res.items.length; i++) {
        var albumId = String(instance) + "-albumId-" + String(i);
        var playElement = $("<button></button>").attr("id", albumId);
        playElement.attr({ externalLink: `${res.items[i].external_urls.spotify}`, class: "spotifyAlbumButtons" });
        var albums = playElement.html(
          `<p><b>Album Name:</b> ${res.items[i].name}</p><p><b>Album Type:</b> ${res.items[i].type}</p><p><b>Release Date:</b> ${res.items[i].release_date}</p>`
        );
        //Adds the album button to the html
        $("#" + listId).append(albums);
        //Creates an event listener for the button
        $("#" + albumId).on("click", openNewWindow);
      }
    });
}

//Searches the button for an externalLink attribute and opens that link in a new tab
function openNewWindow(event) {
  var externalLink = $(this).attr("externalLink");
  window.open(externalLink, "_blank");
  console.log("finished");
}

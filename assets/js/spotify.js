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

// $('#artistName', function{
//   var musixMatchArtist = $('musixArtist').value()
//   //check artist for spaces and replace with '+'
//   if(musixMatchArtist.includes(' ') === true){
//     for(i=0; i <  musixMatchArtist.length; i++){
//       if( musixMatchArtist[i] == ' ') {
//          musixMatchArtist[i] == '+'
//       }
//     }}
// }).click();

fetch("https://accounts.spotify.com/api/token", requestOptions)
  .then(function (res) {
    // console.log(res);
    return res.json();
  })
  .then(function (res) {
    console.log(res, res.access_token, "test one");
    var access_token = res.access_token;

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    //change api endpoint
    var musixMatchArtist = "jay-z";
    var fetchUrl = "https://api.spotify.com/v1/search?q=artist%3A" + musixMatchArtist + "&type=artist";
    String(fetchUrl);
    return fetch(fetchUrl, requestOptions);

    // return fetch("https://api.spotify.com/v1/search?q=artist%3Ajay-z&type=artist", requestOptions);
  })
  .then(function (res) {
    // console.log(res, "res");
    return res.json();
  })

  .then(function (res) {
    // console.log(res);
    var artistFollowers = [];
    var topResults = [];
    for (i = 0; i < res.artists.limit; i++) {
      var following = res.artists.items[i].followers.total;
      artistFollowers.push(following);
    }
    artistFollowers.sort(function (a, b) {
      return a - b;
    });
    // console.log(artistFollowers, "artistFollowers ordered test");
    for (i = artistFollowers.length - 1; i > artistFollowers.length - 4; i--) {
      for (x = 0; x < res.artists.limit; x++) {
        if (artistFollowers[i] == res.artists.items[x].followers.total) {
          var data = [
            { name: res.artists.items[x].name, sheep: artistFollowers[i], href: res.artists.items[x].external_urls.spotify, id: res.artists.items[x].id },
          ];
          topResults.push(data);
        }
      }
    }
    console.log(topResults, "topResults");
    console.log(res, "test two");

    // fetch("https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=artist%3Abeyonce&type=artist", options).then(function (res) {
    //   console.log(res.json, "test 3");

    //   //   return res.json();
    // });
  });

//offer selected artists playlist

// $('chosenArtistUsernameButton', function{
fetch("https://accounts.spotify.com/api/token", requestOptions)
  .then(function (res) {
    return res.json();
  })
  .then(function (res) {
    // console.log(res, res.access_token, "test one");
    var access_token = res.access_token;

    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${access_token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    //change artistID to recieve the buttons cooresponding dataset id
    var artistId = "3nFkdlSjzX9mRTtwJOzDYB";

    var fetchUrl = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
    String(fetchUrl);
    return fetch(fetchUrl, requestOptions);
  })
  .then(function (res) {
    // console.log(res, "res");
    return res.json();
  })
  .then(function (res) {
    console.log(res);
    //get external_urls, name (of album), release_date, and total_tracks
    // var albumList = [];
    // var albums = [{
    // Repeat lines 74-82 here with new variable names
    // }]
  });
// .click();

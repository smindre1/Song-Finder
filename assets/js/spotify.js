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
    //change api endpoint of line 39
    return fetch("https://api.spotify.com/v1/search?q=artist%3Ajay-z&type=artist", requestOptions);
  })
  .then(function (res) {
    // console.log(res);
    return res.json();
  })
  .then(function (res) {
    for (i = 0; i < res.artists.limit; i++) {
      console.log(i, res.artists.items[i].followers, "main test");
    }
    console.log(res, "test two");
    console.log(typeof res.artists.limit, "res length");
    // //Write code here-Or function
    // var artist = "beyonce";
    // var search = "https://api.spotify.com/v1/search/artist:beyonce" + artist;

    // var options = { headers: { Authorization: "Bearer " + res.access_token } };

    // fetch("https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?q=artist%3Abeyonce&type=artist", options).then(function (res) {
    //   console.log(res.json, "test 3");

    //   //   return res.json();
    // });
  });

//search artist code
//https://api.spotify.com/v1/search/artist: + artist

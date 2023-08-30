var my_clientID = "6b436b1d69fb4fd4b9257fb9c76549f7";
var clientSecret = "211deb0626a845768b0b917dec296137";

let myHeaders = new Headers();
myHeaders.append("Authorization", `Basic ${my_clientID}:${clientSecret}`);
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
    console.log(res);
    return res.json();
  })
  .then(function (res) {
    console.log(res, res.access_token);
    // return res.json();
  });
// res = await res.json();
// return res.access_token;

// var client_id = "6b436b1d69fb4fd4b9257fb9c76549f7";
// var client_secret = "211deb0626a845768b0b917dec296137";

// var authOptions = {
//   url: "https://accounts.spotify.com/api/token",
//   headers: {
//     Authorization: "Basic " + new Buffer.from(client_id + ":" + client_secret).toString("base64"),
//   },
//   form: {
//     grant_type: "client_credentials",
//   },
//   json: true,
// };

// request.post(authOptions, function (error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var token = body.access_token;
//     // console.log(token);
//   }
// });

// //https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow

// // curl -X POST "https://accounts.spotify.com/api/token" \
// //      -H "Content-Type: application/x-www-form-urlencoded" \
// //      -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"

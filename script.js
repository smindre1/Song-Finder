import { searchSoundCloud } from './soundcloud.js';
import { searchMusixmatchJSONP } from './musixmatch.js';

// Get references to HTML elements
const queryInput = document.getElementById('query');
const searchButton = document.getElementById('search-button');
const soundcloudResultsDiv = document.getElementById('soundcloud-results');
const musixmatchResultsDiv = document.getElementById('musixmatch-results');

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const query = queryInput.value;

    // Perform a SoundCloud API search
    searchSoundCloud(query);

    // Perform a Musixmatch API search using JSONP
    searchMusixmatchJSONP(query);
});
// soundcloud.js

// Function to search SoundCloud using a server-side proxy
export function searchSoundCloud(query) {
    fetch(`/search-soundcloud?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            displaySoundCloudResults(data);
        })
        .catch(error => {
            console.error('SoundCloud API Error:', error);
        });
}

// Function to display SoundCloud search results
function displaySoundCloudResults(results) {
    // Display SoundCloud results in the soundcloudResultsDiv
    // You can format and style this as needed
    soundcloudResultsDiv.innerHTML = JSON.stringify(results, null, 2);
}
// musixmatch.js

// Function to search Musixmatch using JSONP
export function searchMusixmatchJSONP(query) {
    const apiKey = 'YOUR_MUSIXMATCH_API_KEY';

    // Create a script element to load the JSONP data
    const script = document.createElement('script');
    script.src = `https://api.musixmatch.com/ws/1.1/track.search?q_lyrics=${encodeURIComponent(query)}&apikey=${apiKey}&callback=handleMusixmatchResponse`;

    // Define the callback function to handle the JSONP response
    window.handleMusixmatchResponse = function (data) {
        displayMusixmatchResults(data);
        // Remove the script element after the data is loaded
        document.head.removeChild(script);
        delete window.handleMusixmatchResponse;
    };

    // Append the script element to the document
    document.head.appendChild(script);
}

// Function to display Musixmatch search results
function displayMusixmatchResults(results) {
    // Display Musixmatch results in the musixmatchResultsDiv
    // You can format and style this as needed
    musixmatchResultsDiv.innerHTML = JSON.stringify(results, null, 2);
}

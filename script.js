// script.js

// Get reference to the playlist link
const playlistLink = document.querySelector('.playlist-link');

document.addEventListener('DOMContentLoaded', function() {
    // Your JavaScript code here, including the event listener setup
    const searchButton = document.getElementById('search-button');
    // Add event listener to searchButton
});

// Placeholder function for displaying search results
function displaySearchResults(results) {
    // Get the container where you want to display the results
    const resultsContainer = document.getElementById('musixmatch-results');

    // Clear any previous results
    resultsContainer.innerHTML = '';

    // Loop through the search results
    results.forEach(result => {
        // Create a div to hold each result
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('result');

        // Create a paragraph to display the artist's name
        const artistParagraph = document.createElement('p');
        artistParagraph.textContent = `Artist: ${result.artist}`;

        // Create a "View Playlist" button
        const viewPlaylistButton = document.createElement('button');
        viewPlaylistButton.textContent = 'View Playlist';

        // Add a click event listener to the button to navigate to the playlist page
        viewPlaylistButton.addEventListener('click', () => {
            // Replace 'playlist.html' with the actual URL of your playlist page
            window.location.href = 'playlist.html';
        });

        // Append the artist's name and the "View Playlist" button to the result div
        resultDiv.appendChild(artistParagraph);
        resultDiv.appendChild(viewPlaylistButton);

        // Append the result div to the results container
        resultsContainer.appendChild(resultDiv);
    });
}



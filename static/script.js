// let lyrics = [];
// let currentLineIndex = 0;
// let intervalId;

// document.getElementById('startButton').addEventListener('click', function() {
//     const lrcContent = document.getElementById('lrcInput').value;
//     parseLrc(lrcContent);
//     if (lyrics.length > 0) {
//         currentLineIndex = 0; // Reset index to start from the beginning
//         displayLyrics();
//         startLyricsDisplay();
//     } else {
//         alert("No valid lyrics found.");
//     }
// });

// function parseLrc(lrcContent) {
//     const lines = lrcContent.split('\n');
//     lyrics = [];

//     lines.forEach(line => {
//         const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
//         if (match) {
//             const minutes = parseInt(match[1], 10);
//             const seconds = parseFloat(match[2]);
//             const text = match[3].trim();
//             const timeInSeconds = minutes * 60 + seconds;
//             lyrics.push({ time: timeInSeconds, text });
//         }
//     });

//     // Sort lyrics by time
//     lyrics.sort((a, b) => a.time - b.time);
// }

// function startLyricsDisplay() {
//     if (intervalId) clearInterval(intervalId); // Clear any existing interval

//     let currentTime = 0;

//     intervalId = setInterval(() => {
//         currentTime += 0.1; // Increment current time by 100ms

//         if (currentLineIndex < lyrics.length && currentTime >= lyrics[currentLineIndex].time) {
//             displayCurrentLine();
//             currentLineIndex++;
//         }

//         // Stop when all lines have been displayed
//         if (currentLineIndex >= lyrics.length) {
//             clearInterval(intervalId); 
//             document.getElementById('lyricsDisplay').innerText += "\nEnd of Lyrics";
//         }
//     }, 100); // Check every 100 milliseconds
// }

// function displayLyrics() {
//     const displayArea = document.getElementById('lyricsDisplay');
//     displayArea.innerHTML = ''; // Clear previous content

//     // Display all lines in the display area
//     lyrics.forEach((line, index) => {
//         const lineDiv = document.createElement('div');
//         lineDiv.innerText = line.text;
//         lineDiv.dataset.index = index; // Store the index for scrolling
//         displayArea.appendChild(lineDiv);
//     });
// }

// function displayCurrentLine() {
//     const displayArea = document.getElementById('lyricsDisplay');
    
//     // Remove highlight from all lines
//     Array.from(displayArea.children).forEach(child => child.classList.remove('current-line'));
    
//     // Highlight the current line
//     if (currentLineIndex < lyrics.length) {
//         const currentLineDiv = displayArea.children[currentLineIndex];
//         currentLineDiv.classList.add('current-line');
        
//         // Scroll to the current line
//         currentLineDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     }
// }

let lyricss = [];
let currentLineIndex = 0;
let intervalId;
let isPlaying = false; // Track playback state

function loadLyrics() {
    const lrcContent = syncedLyrics;
    parseLrc(lrcContent);
    if (lyrics.length > 0) {
        currentLineIndex = 0; // Reset index to start from the beginning
        displayLyrics();
        startLyricsDisplay();
    } else {
        alert("No valid lyrics found.");
    }
}

document.getElementById('playPauseButton').addEventListener('click', function() {
    if (isPlaying) {
        pauseLyrics();
    } else {
        playLyrics();
    }
});

function parseLrc(lrcContent) {
    const lines = lrcContent.split('\n');
    lyrics = [];

    lines.forEach(line => {
        const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseFloat(match[2]);
            const text = match[3].trim();
            const timeInSeconds = minutes * 60 + seconds;
            lyrics.push({ time: timeInSeconds, text });
        }
    });

    // Sort lyrics by time
    lyrics.sort((a, b) => a.time - b.time);
}

function startLyricsDisplay() {
    if (intervalId) clearInterval(intervalId); // Clear any existing interval

    let currentTime = 0;

    intervalId = setInterval(() => {
        if (isPlaying) { // Only update if playing
            currentTime += 0.1; // Increment current time by 100ms

            if (currentLineIndex < lyrics.length && currentTime >= lyrics[currentLineIndex].time) {
                displayCurrentLine();
                currentLineIndex++;
            }

            // Stop when all lines have been displayed
            if (currentLineIndex >= lyrics.length) {
                clearInterval(intervalId); 
                document.getElementById('lyricsDisplay').innerText += "\nEnd of Lyrics";
                pauseLyrics(); // Automatically pause when done
            }
        }
    }, 100); // Check every 100 milliseconds
}

function playLyrics() {
    isPlaying = true;
    document.getElementById('playPauseButton').innerHTML = '<i data-feather="play"></i>'; // Change button text
}

function pauseLyrics() {
    isPlaying = false;
    document.getElementById('playPauseButton').innerHTML = '<i data-feather="play"></i>'; // Change button text
}

function displayLyrics() {
    const displayArea = document.getElementById('lyricsDisplay');
    displayArea.innerHTML = ''; // Clear previous content

    // Display all lines in the display area
    lyrics.forEach((line, index) => {
        const lineDiv = document.createElement('div');
        lineDiv.innerText = line.text;
        lineDiv.dataset.index = index; // Store the index for scrolling
        displayArea.appendChild(lineDiv);
    });
}

function displayCurrentLine() {
    const displayArea = document.getElementById('lyricsDisplay');
    
    // Remove highlight from all lines
    Array.from(displayArea.children).forEach(child => child.classList.remove('current-line'));
    
    // Highlight the current line
    if (currentLineIndex < lyrics.length) {
        const currentLineDiv = displayArea.children[currentLineIndex];
        currentLineDiv.classList.add('current-line');
        
        // Scroll to the current line
        currentLineDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

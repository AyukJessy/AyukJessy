// facial-recognition.js

// Import the face-api.js library
import * as faceapi from 'face-api.js';

// Set up canvas and video elements
document.body.append('
  <video id="video" width="720" height="560" style="display:none"></video>
  <canvas id="overlay" width="720" height="560"></canvas>
');

const video = document.getElementById('video');

// Load models
aasync function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

// Start video stream
async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    video.play();
}

// Detect face and draw landmarks
video.addEventListener('play', async () => {
    const canvas = document.getElementById('overlay');
    faceapi.matchDimensions(canvas, { width: video.width, height: video.height });
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, { width: video.width, height: video.height });
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
});

// Initialize the application
loadModels().then(startVideo);
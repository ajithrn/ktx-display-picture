/**
 * KTX Profile Picture Frame Generator
 * Ver: 1.0
 * Author: Ajith
 * URL: https://ajithrn.com
 * JS
 */

document
  .getElementById('uploadImage')
  .addEventListener('change', handleImageUpload);
const framesContainer = document.getElementById('framesContainer');
const resultCanvas = document.getElementById('resultCanvas');
const ctx = resultCanvas.getContext('2d');
const previewImage = document.getElementById('previewImage');
let uploadedImage = null;
let selectedFrame = null;

// Handle the file upload event
function handleImageUpload(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    uploadedImage = new Image();
    uploadedImage.onload = renderCompositeImage;
    uploadedImage.src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

// This helper function crops the image to the largest possible centered square
function cropToSquare(imageObj, context) {
  const size = Math.min(imageObj.width, imageObj.height);
  const offsetX = (imageObj.width - size) / 2;
  const offsetY = (imageObj.height - size) / 2;

  context.drawImage(
    imageObj,
    offsetX,
    offsetY, // Start at x/y pixels from the left and the top of the image (crop),
    size,
    size, // "Get" a `size * size` (w * h) area from the source image (crop),
    0,
    0, // Place the result at 0, 0 in the canvas,
    context.canvas.width,
    context.canvas.height // With as width / height: 100 * 100 (scale)
  );
}

// Rest of your code where you handle the rendering...
function renderCompositeImage() {
  if (!uploadedImage || !selectedFrame) return;
  ctx.clearRect(0, 0, resultCanvas.width, resultCanvas.height);

  // Use the helper function to draw the uploaded image as a square
  cropToSquare(uploadedImage, ctx);

  // Draw the frame
  ctx.drawImage(selectedFrame, 0, 0, resultCanvas.width, resultCanvas.height);

  updatePreviewImage();
}

// This function should update the previewImage's src attribute to show the composite image
function updatePreviewImage() {
  previewImage.src = resultCanvas.toDataURL('image/png');
  previewImage.style.display = 'block';
}

// Download button click event
document.getElementById('downloadBtn').addEventListener('click', function () {
  const downloadLink = document.createElement('a');
  downloadLink.href = resultCanvas
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  downloadLink.download = 'ktx_expo_profile_picture.png';
  downloadLink.click();
});

// For share options, you can use the Web Share API where supported
document.getElementById('shareBtn').addEventListener('click', function () {
  if (navigator.share) {
    resultCanvas.toBlob((blob) => {
      const file = new File([blob], 'ktx_expo_profile_picture.png', {
        type: 'image/png',
      });
      navigator
        .share({
          files: [file],
          title: 'Kerala Technology Expo 2024',
          text: 'I am Attending Kerala Technology Expo (KTX), 2024',
        })
        .then(() => console.log('Share was successful.'))
        .catch(console.error);
    }, 'image/png');
  } else {
    // Fall back to displaying social share links / error message
    const fallbackShareLinks = document.getElementById('fallbackShare');
    fallbackShareLinks.classList.add('visible');

    //  TODO: adding fall back social share options.
    // Update the share URLs with the link to the current photo
    fallbackShareLinks.querySelectorAll('a').forEach(function(anchor) {
        const originalHref = anchor.href;
        const service = anchor.textContent.toLowerCase();
        
        if (service === 'facebook' || service === 'twitter' || service === 'linkedin') {
            // Replace 'URL' in each service's URL with the encoded photo URL
            anchor.href = originalHref.replace('URL', currentPhotoUrl);
        }
    });
}
});

/**
 * Constructs an absolute URL for a given image path.
 * @param {string} imagePath - The relative path to the image.
 * @returns {string} The absolute URL to the image.
 */
function getAbsoluteImageUrl(imagePath) {
  const baseUrl = window.location.href;
  const absoluteUrl = new URL(imagePath, baseUrl).href;
  return absoluteUrl;
}

// Add the frame selection functionality
// Assuming you have an array of available frames (e.g., frameSource)
const frameSource = [
  getAbsoluteImageUrl('assets/frames/meet.png'),
  getAbsoluteImageUrl('assets/frames/attendee.png'),
  getAbsoluteImageUrl('assets/frames/speaker.png'),
  getAbsoluteImageUrl('assets/frames/sponsor.png'),
];
frameSource.forEach((src) => {
  const frameImg = new Image();
  frameImg.src = src;
  frameImg.onclick = function () {
    selectedFrame = frameImg;
    renderCompositeImage();
  };
  framesContainer.appendChild(frameImg);
});

const uploadContainer = document.getElementById('uploadContainer');
const imageUpload = document.getElementById('imageUpload');
const uploadForm = document.getElementById('uploadForm');
const outputDiv = document.getElementById('output');
const errorMessage = document.getElementById('errorMessage');
const uploadButton = document.getElementById('submitButton'); // Ensure this matches your HTML
const loadingGif = document.getElementById('loading');
let uploadedFile = null;

function handleFiles(files) {
    console.log("Handling files...");
    const file = files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = function () {
        uploadContainer.innerHTML = '<p class="message">Photo uploaded successfully!</p>';
        uploadedFile = file;
        errorMessage.style.display = 'none';
        console.log("Image loaded successfully.");
    };
    img.onerror = function () {
        alert('Invalid image file.');
        console.log("Error loading image.");
    };
}

// Event Listeners
uploadContainer.addEventListener('click', () => {
    console.log("Upload container clicked.");
    imageUpload.click();
});

uploadContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadContainer.classList.add('dragover');
});

uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
});

uploadContainer.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadContainer.classList.remove('dragover');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        imageUpload.files = files; // Assign dropped files to input
        handleFiles(files); // Call handleFiles to process the dropped file
    }
});

// Correct variable name from fileInput to imageUpload
imageUpload.addEventListener('change', () => {
    console.log("Image input changed.");
    const files = imageUpload.files;
    handleFiles(files);
});

uploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!uploadedFile) {
        errorMessage.style.display = 'block'; // Show error if no file uploaded
        console.log("No file uploaded.");
    } else {
        errorMessage.style.display = 'none';
        loadingGif.style.display = 'inline-block'; // Show loading GIF
        console.log("Preparing to upload...");

        // Prepare form data for submission
        const formData = new FormData(event.target);
        formData.append('image', uploadedFile); // Append the uploaded file

        // Make the API call to upload the image
        try {
            const response = await fetch('http://127.0.0.1:8000/api/cnn-predict/', {
                method: 'POST',
                body: formData,
            });

            console.log("Response received:", response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${errorText}`);
            }

            const result = await response.json(); // Get JSON response
            console.log("Result from server:", result);
            loadingGif.style.display = 'none'; // Hide loading GIF

            // Uploaded Image
            const uploadedImg = new Image();
            uploadedImg.src = result.original_image;
            uploadedImg.style.width = "300px";

            // Detected Image from Response
            const detectionImg = new Image();
            detectionImg.src = result.detected_image; // Make sure this is correct
            detectionImg.style.width = "300px";

            // HTML for displaying both images side by side
            const outputHtml = `
                <div style="display: flex; justify-content: space-around; align-items: center; gap: 20px; margin-top: 20px;">
                    <div style="text-align: center;">
                        <h2 style="font-size: 1.5em;">Uploaded Image:</h2>
                        ${uploadedImg.outerHTML}
                    </div>
                    <div style="text-align: center;">
                        <h2 style="font-size: 1.5em;">Detected Faults:</h2>
                        ${detectionImg.outerHTML}
                    </div>
                </div>
            `;

            // Inject the HTML into the outputDiv
            outputDiv.innerHTML = outputHtml;

            // Display the output section and smoothly scroll to it
            document.getElementById('section2').style.display = 'block';
            window.scrollTo({
                top: outputDiv.offsetTop,
                behavior: 'smooth',
            });

        } catch (error) {
            console.error('Error:', error);
            loadingGif.style.display = 'none'; // Hide loading GIF
            outputDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
            document.getElementById('section2').style.display = 'block';
            window.scrollTo({
                top: outputDiv.offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Form validation function
function validateForm() {
    if (!uploadedFile) {
        alert('Please upload an image first.');
        return false;
    }
    return true;
}

// Add form validation on button click
uploadButton.addEventListener('click', (event) => {
    if (!validateForm()) {
        event.preventDefault(); // Prevent form submission
    }
});

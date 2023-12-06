const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileUpload');
const fileDisplayArea = document.getElementById('fileDisplayArea');
const uploadButton = document.querySelector('input[type="submit"]');
let selectedFiles = [];

function updateDropZoneBackground() {
    if (selectedFiles.length === 0) {
        dropZone.style.backgroundImage = "url('/src/img/upload.svg')";
    } else {
        dropZone.style.backgroundImage = "url('/src/img/empty.svg')";
    }
}

function updateUploadButtonVisibility() {
    if (selectedFiles.length === 0) {
        uploadButton.style.display = 'none';
    } else {
        uploadButton.style.display = '';
    }
}

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    addFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
    addFiles(fileInput.files);
});

function addFiles(files) {
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        if (!selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    }
    displayFiles();
    updateDropZoneBackground();
    updateUploadButtonVisibility();
}

function removeFile(index, event) {
    event.stopPropagation(); // Prevent event from bubbling up to parent elements
    selectedFiles.splice(index, 1);
    displayFiles();
    updateDropZoneBackground();
    updateUploadButtonVisibility();
}

function displayFiles() {
    fileDisplayArea.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        let fileElement = document.createElement('div');
        fileElement.className = 'file-item';
        fileElement.innerHTML = `
            <span onclick="removeFile(${index}, event)">${file.name}</span>
            <img src="/src/img/trash.svg" onclick="removeFile(${index}, event)" alt="Remove">
        `;
        fileDisplayArea.appendChild(fileElement);
    });
}

document.getElementById('fileUploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData(this);
    for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files[]', selectedFiles[i]);
    }

    fetch('/upload_files', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Check if upload was successful
        if (data.success) {
            // Close the window
            window.close();
        } else {
            // Handle the case where upload wasn't successful
            console.error('Upload failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle network errors or other issues
    });
});

// Initial setup
updateDropZoneBackground();
updateUploadButtonVisibility();


        // Access the webcam video stream
        const video = document.getElementById('webcam');
        const captureBtn = document.getElementById('captureBtn');
        const uploadBtn = document.getElementById('uploadBtn');
        const canvasContainer = document.getElementById('canvasContainer');
        
        let captureCount = 0;
        const maxCaptures = 5;
        const capturedImages = [];

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(error => {
                console.error('Error accessing the webcam: ', error);
            });

        captureBtn.addEventListener('click', () => {
            if (captureCount < maxCaptures) {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                capturedImages.push(canvas.toDataURL('image/png'));
                canvasContainer.appendChild(canvas);
                captureCount++;

                if (captureCount === maxCaptures) {
                    captureBtn.disabled = true;
                    uploadBtn.style.display = 'block';
                }
            }
        });

        uploadBtn.addEventListener('click', () => {
            capturedImages.forEach((dataURL, index) => {
                // Create a form to upload each image
                const formData = new FormData();
                formData.append('file', dataURItoBlob(dataURL), webcam_image_${index + 1}.png);

                // Send the image to the server (adjust the URL to your server endpoint)
                fetch('/upload', {
                    method: 'POST',
                    body: formData
                }).then(response => response.json())
                  .then(result => {
                      console.log(`Success for image ${index + 1}:`, result);
                  })
                  .catch(error => {
                      console.error(`Error for image ${index + 1}:`, error);
                  });
            });
        });

        function dataURItoBlob(dataURI) {
            const byteString = atob(dataURI.split(',')[1]);
            const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeString });
        }


document.getElementById("submit").addEventListener('click', function(event){
    event.preventDefault();
    displayHousePrice();
});

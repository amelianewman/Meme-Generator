document.addEventListener('DOMContentLoaded', function () {
    const canvas = new fabric.Canvas('canvas');
    let resizingFactor = 0.5; 

    // Efface le contenu du canvas
    function clearCanvas() {
        canvas.clear();
    }

    // Redimensionne une image
    function resizeImage(imgToResize, factor) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const originalWidth = imgToResize.width;
        const originalHeight = imgToResize.height;

        const canvasWidth = originalWidth * factor;
        const canvasHeight = originalHeight * factor;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        context.drawImage(
            imgToResize,
            0,
            0,
            originalWidth * factor,
            originalHeight * factor
        );

        return canvas.toDataURL();
    }

    // Charge l'image sur le canvas
    function loadImage(file) {
        clearCanvas(); // Efface le contenu du canvas avant de charger une nouvelle image

        const reader = new FileReader();
        reader.onload = function (event) {
            const imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {
                // Redimensionne l'image avant de l'ajouter au canvas
                const factor = calculateResizingFactor(imgObj.width, imgObj.height);
                resizingFactor = factor; 

                const resizedDataURL = resizeImage(imgObj, factor);

                const image = new fabric.Image();
                fabric.Image.fromURL(resizedDataURL, function (img) {
                    image.set(img);
                    image.set({
                        selectable: false // Rend l'image fixe dans le canvas
                    });

                    canvas.add(image);
                    canvas.renderAll();

                    // Ajuster la taille du canvas à la taille de l'image
                    canvas.setDimensions({ width: image.width, height: image.height });
                });
            }
        };
        reader.readAsDataURL(file);
    }

    // Calcule le facteur de redimensionnement en fonction de la largeur et de la hauteur
    function calculateResizingFactor(width, height) {
        const maxWidth = 700; 
        const maxHeight = 600; 

        const widthFactor = maxWidth / width;
        const heightFactor = maxHeight / height;

        return Math.min(widthFactor, heightFactor);
    }

    // Gestion de l'upload d'image via l'input de fichier
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        loadImage(file);
    });

    // Ajoute du texte sur le canvas
    document.getElementById('add-text').addEventListener('click', function () {
        const text = document.getElementById('text').value;
        const textbox = new fabric.Textbox(text, {
            left: 50,
            top: 50,
            width: 200,
            fontSize: 20,
            fontFamily: 'Impact',
            strokeWidth: 0.7,
            stroke: '#000000',
            fill: '#ffffff',
        });
        canvas.add(textbox);
        canvas.renderAll();
    });

    // Enregistre l'image
    function saveImage() {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        // Crée un lien temporaire pour télécharger l'image
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'meme.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Met à jour la galerie avec l'image en base64
        const gallery = document.getElementById('memes-container');
        const img = new Image();
        img.src = dataURL;
        img.className = "meme-item";
        gallery.appendChild(img);
    }

    // Gestionnaire d'événement pour le bouton "Enregistrer l'image"
    document.getElementById('save-image').addEventListener('click', saveImage);
});


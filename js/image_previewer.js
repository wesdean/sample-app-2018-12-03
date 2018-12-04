(function () {
  // Declare the main elements for the application
  const dropZone = document.getElementById("dropZone");
  const innerDropZone = document.getElementById("innerDropZone");
  const addByUrlForm = document.getElementById("addByUrlForm");

  // Prevent default actions and propagation on drag and drop events.
  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, event => {
      event.preventDefault();
      event.stopPropagation();
    }, false);
  });

  // Change the drop zone border when holding an item over it.
  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.add("drag-over");
    });
  });

  // Reset drop zone border when no longing holding item over it.
  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.classList.remove("drag-over");
    });
  });

  // Read the dropped files and add image previews to the drop zone.
  // Multiple files can be added at the same time, non-image files will be ignored.
  dropZone.addEventListener("drop", (event) => {
    let files = event.dataTransfer.files;
    for (let i in files) {
      let file = files[i];
      if (typeof file !== "object" || !file.type.match("image/*")) {
        continue;
      }
      let reader = new FileReader();
      reader.onload = (function (readerFile) {
        return function (readerEvent) {
          addImage(readerFile.name, readerEvent.target.result);
          evalDropZone();
        }
      })(file);

      reader.readAsDataURL(file);
    }
  }, false);

  // Handle previewing an image from a URL.
  // We do not check the URL here. If it is not a valid image URL the image's preview will be broken.
  addByUrlForm.addEventListener("submit", event => {
    event.preventDefault();

    let inputBox = document.getElementById("addByUrlText");
    let url = inputBox.value;

    let filename = url.substring(url.lastIndexOf("/") + 1);
    addImage(filename, url);
    evalDropZone();
  }, false);

  // Add the image preview to the drop zone.
  // Clicking the preview will remove it from the drop zone.
  function addImage(name, src) {
    let div = document.createElement("div");
    div.classList.add("drop-zone-image");
    div.title = "Click to remove";

    let img = document.createElement("img");
    img.src = src;
    img.alt = name;

    div.appendChild(img);

    div.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();

      let toRemove = event.target;
      while (toRemove !== div) {
        toRemove = event.target.parentElement;
      }
      if (toRemove === div) {
        innerDropZone.removeChild(toRemove)
      }
      evalDropZone();
    }, true);

    innerDropZone.appendChild(div);
  }

  // Evaluate the drop zone and handle state changes.
  function evalDropZone() {
    if (innerDropZone.children.length > 0) {
      dropZone.classList.add("has-image");
    } else {
      dropZone.classList.remove("has-image");
    }
  }
})();
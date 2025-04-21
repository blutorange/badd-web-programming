let urls = [];
let mediaStream = undefined;

/**
 * Spielt Video von Webcam ab oder stopp es wieder.
 */
async function toggleVideo() {
  // Video anhalten
  if (mediaStream) {
    mediaStream = null;
    document.querySelector(".video").pause();
    document.querySelector(".videos").innerHTML = "";
    document.querySelector(".play-video").textContent = "Starte Video!";
    document.querySelector(".take-screenshot").classList.add("hidden");
    document.querySelector(".screens").innerHTML = "";
    return;
  }
  // Video starten
  try {
    // Auf die Kamera zugreifen
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    // Neues <video> erzeugen und mit der Kamera verbinden
    const video = document.createElement("video");
    video.classList.add("video");
    video.srcObject = stream;
    video.controls = true;
    document.querySelector(".videos").append(video);
    mediaStream = stream;
    video.play();

    // UI aktualisieren
    document.querySelector(".play-video").textContent = "Stoppe Video!";
    document.querySelector(".take-screenshot").classList.remove("hidden");
  } catch (e) {
    document.querySelector(".error").textContent =
      `Konnte nicht auf Video zugreifen: ${e}`;
  }
}

/**
 * Macht einen Screenshot, wenn gerade Video abgespielt wird.
 */
async function takeScreenshot() {
  // Discard previously taken screenshots
  for (const url of urls) {
    URL.revokeObjectURL(url);
  }
  urls = [];

  // Clean output
  const screens = document.querySelector(".screens");
  screens.innerHTML = "";

  try {
    // Take photo of each track and add to output
    for (const track of mediaStream.getVideoTracks()) {
      const capture = new ImageCapture(track);
      const photo = await capture.takePhoto();
      const img = document.createElement("img");
      const url = URL.createObjectURL(photo);
      urls.push(url);
      img.src = url;
      screens.append(img);
    }
  } catch (e) {
    document.querySelector(".error").textContent =
      `Konnte Screenshot nicht aufnehmen: ${e}`;
  }
}

document
  .querySelector(".take-screenshot")
  .addEventListener("click", takeScreenshot);
document.querySelector(".play-video").addEventListener("click", toggleVideo);

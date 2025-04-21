/**
 * Returns a promise that resolves with the current location of the user;
 * and rejects when the position cannot be determined or the user denies
 * access to their location.
 * @returns {Promise<GeolocationPosition>} The position of the user.
 */
function geoLocate() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (g) => resolve(g),
      (e) => reject(new Error(`${e.code}: ${e.message}`)),
    );
  });
}

async function onGeoLocate() {
  try {
    const position = await geoLocate();
    document.querySelector(".latitude").value = position.coords.latitude;
    document.querySelector(".longitude").value = position.coords.longitude;
    showOnMap(position.coords.latitude, position.coords.longitude);
  } catch (e) {
    document.querySelector(".error").textContent =
      `Konnte dich nicht finden :(\n${e}`;
  }
}

function showOnMap(latitude, longitude) {
  const map = L.map("map").setView([latitude, longitude], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  L.marker([latitude, longitude]).addTo(map)
    .bindPopup('Habe ich dich gefunden :)')
    .openPopup();
}

document.querySelector(".find-me").addEventListener("click", onGeoLocate);

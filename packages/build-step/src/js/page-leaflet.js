/// <reference path="./resources.d.ts" />

// @ts-check

import { Icon, Map as LeafletMap, Marker, TileLayer } from "leaflet";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";

const map = new LeafletMap("leaflet-map").setView([51.05089, 13.73832], 13);
new TileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	attribution:
		'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

/** @type {Marker | undefined} */
let marker;

document.querySelector("#show-marker")?.addEventListener("click", () => {
	if (!marker) {
		marker = createMarker();
	}
	marker?.openPopup();
});

/**
 * @returns {Marker}
 */
function createMarker() {
	const icon = new Icon({
		iconUrl: markerIconUrl,
		iconSize: [25, 41],
		iconAnchor: [12, 40],
		popupAnchor: [0, -40],
	});
	return new Marker([51.05196, 13.74163], { icon })
		.addTo(map)
		.bindPopup("Die Frauenkirche");
}

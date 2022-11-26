const lat = document.querySelector("#latPos");
const long = document.querySelector("#longPos");
const trackSatelliteBtn = document.querySelector("#trackSatellite");

const satelliteID = 25544;

// creating the map
const map = L.map(`satelliteMap`).setView([0, 0], 2);
// setting tile url and the attribution
const tileFormat = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`;
/////// attribution should be in {}, cz the lib is expecting to be an object
const tiles = L.tileLayer(tileFormat, { attribution: attribution });
// adding tile and attribution to the map
tiles.addTo(map);

// creating icon
const satelliteIcon = L.icon({
	iconUrl: `imgs/iss.png`,
	iconSize: [50, 40],
	iconAnchor: [25, 20],
});

// creating a marker with casual coord and the icon <== should be in {}
const satelliteMarker = L.marker([0, 0], { icon: satelliteIcon });
// setting the marker into the map
satelliteMarker.addTo(map);

async function trackSatellite(urlID) {
	const id = await getId(urlID);
	setInterval(() => {
		getPos(id);
	}, 1000);
}

async function getId(url) {
	const res = await fetch(url);
	const j = await res.json();
	return j[0].id;
}

async function getPos(satelliteID) {
	const res = await fetch(
		`https://api.wheretheiss.at/v1/satellites/${satelliteID}`
	);
	const j = await res.json();

	return updatePos(j.longitude, j.latitude);
}

function updatePos(longPos, latPos) {
	satelliteMarker.setLatLng([latPos, longPos]);
	long.textContent = longPos;
	lat.textContent = latPos;
	return { lat: latPos, long: longPos };
}

window.addEventListener("load", () => {
	trackSatellite("https://api.wheretheiss.at/v1/satellites");
	trackSatelliteBtn.click();
});

trackSatelliteBtn.addEventListener("click", async () => {
	const res = await getPos(satelliteID);
	map.setView([res.lat, res.long], 4);
});

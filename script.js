const center = [8.3695, 124.8640];
const map = L.map("map").setView(center, 12);


L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
  maxZoom: 19,
}).addTo(map);


const locations = [
  {
    name: "Manolo Fortich Municipal Hall",
    lat: 8.3695,
    lng: 124.8640,
    description:
      "Municipal government office of Manolo Fortich, Bukidnon.",
  },
  {
    name: "Barangay Alae",
    lat: 8.42264,
    lng: 124.81425,
    description:
      "One of the barangays of the Municipality of Manolo Fortich.",
  },
  {
    name: "Barangay Tankulan",
    lat: 8.3680,
    lng: 124.8645,
    description:
      "Barangay in the Municipality of Manolo Fortich.",
  },
  {
    name: "Barangay Dahilayan",
    lat: 8.2300,
    lng: 124.9160,
    description:
      "Barangay known for its natural attractions and tourism destinations.",
  },
];

locations.forEach(function (place) {
  const marker = L.marker([place.lat, place.lng]).addTo(map);

  marker.bindPopup(
    "<b>" +
      place.name +
      "</b>" +
      "<p>" +
      place.description +
      "</p>" +
      "<p>Latitude: " +
      place.lat +
      "<br>Longitude: " +
      place.lng +
      "</p>"
  );
});


L.circle(center, {
  color: "blue",
  fillColor: "#30a3ec",
  fillOpacity: 0.1,
  radius: 5000,
}).addTo(map);


map.on("click", function (event) {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;

  document.getElementById("coordinates").innerHTML =
    "<b>Latitude:</b> " +
    lat.toFixed(5) +
    "<br><b>Longitude:</b> " +
    lng.toFixed(5);

  L.popup()
    .setLatLng(event.latlng)
    .setContent(
      "<b>Selected Location</b><br>" +
        "Latitude: " +
        lat.toFixed(5) +
        "<br>Longitude: " +
        lng.toFixed(5)
    )
    .openOn(map);
});




let searchMarker = null;


async function searchPlace() {
  const searchInput = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");

  const place = searchInput.value.trim();

  if (place === "") {
    results.textContent = "Please enter a place to search.";
    return;
  }

  results.textContent = "Searching...";

  try {
    
    const searchQuery = place + ", Manolo Fortich, Bukidnon, Philippines";

    const url =
      "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" +
      encodeURIComponent(searchQuery) +
      "&limit=5";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Search service unavailable.");
    }

    const data = await response.json();

    if (data.length === 0) {
      results.textContent =
        "No places found. Try another search.";
      return;
    }

    results.replaceChildren();

    data.forEach(function (location) {
      const button = document.createElement("button");

      button.textContent = location.display_name;

      button.style.display = "block";
      button.style.width = "100%";
      button.style.padding = "10px";
      button.style.marginBottom = "5px";
      button.style.textAlign = "left";
      button.style.cursor = "pointer";

      button.addEventListener("click", function () {
        const lat = Number(location.lat);
        const lng = Number(location.lon);

       
        map.setView([lat, lng], 16);

        
        if (searchMarker) {
          map.removeLayer(searchMarker);
        }

        
        searchMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup(
            "<b>Search Result</b><br>" +
              location.display_name
          )
          .openPopup();

      
        document.getElementById("coordinates").innerHTML =
          "<b>Latitude:</b> " +
          lat.toFixed(5) +
          "<br><b>Longitude:</b> " +
          lng.toFixed(5);

      
        results.replaceChildren();
      });

      results.appendChild(button);
    });

  } catch (error) {
    results.textContent =
      "Unable to search. Please check your internet connection.";
  }
}

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchPlace();
    }
  });

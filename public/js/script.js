(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

// Map
if (document.getElementById("map")) {

    const mapElement = document.getElementById("map");

    const lat = mapElement.dataset.lat;
    const lng = mapElement.dataset.lng;
    const title = mapElement.dataset.title;

    const map = L.map("map").setView([lat, lng], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<h5>${title}</h5>`)
        // .bindPopup(title)
        .openPopup();
}
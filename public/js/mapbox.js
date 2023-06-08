/* eslint-disable */

// const locations = JSON.parse(document.getElementById('map').dataset.locations);

export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW1iaWthcHJhc2FkIiwiYSI6ImNsZzd1bGowNzByNGMzZG83dHRvZGNkOG8ifQ.voAu4NXgxcQFAxrULbM1Ww';
  const map = new mapboxgl.Map({
    container: 'map', // container ID

    // style: 'mapbox://styles/mapbox/streets-v12', // style URL. This was the default style and now we can costomize it
    style: 'mapbox://styles/ambikaprasad/clg7ve7ez000i01ok8fzjrhag', // style URL
    scrollZoom: false
    //   center: [-74.5, 40], // starting position [lng, lat]
    //   zoom: 9 // starting zoom, if we do not define zoom then we are going to see a globe
    //interactive: false //if we set interactive to false then our map is treated like an image we cannot zoom in and out and cannot drag
  });

  const nav = new mapboxgl.NavigationControl(); //this will add a navigation control
  map.addControl(nav, 'top-right');
  //we are able to use mapboxgl becuase in tour.pug we have used script that allow us to use mapbox library
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //add the marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  }); //fitBounds moves and zooms right to the bounds to actually fit them
};

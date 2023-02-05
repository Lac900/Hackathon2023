import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

Leaflet.Icon.Default.imagePath = 'assets/';
const serverURL = "localhost:5000/"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor (private http: HttpClient){}
  title = 'criminalMap';
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 11,
    center: { lat: 45.56010577746812, lng: -73.62072318393797 }
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 45.508890, lng: -73.56123 },
        icon: "../assets/gun.png"
      },
      {
        position: { lat: 45.508870, lng: -73.56126 },
        icon: "../assets/gun.png"
      },
      {
        position: { lat: 45.508880, lng: -73.561632 },
        icon: "../assets/gun.png"
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    const icon = Leaflet.icon({
      iconUrl: data.icon,
      iconSize: [30, 30]
    })
    return Leaflet.marker(data.position,{icon: icon} )
      .on('click', (event) => this.markerClicked(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
    const headers = new HttpHeaders({"Access-Control-Allow-Origin": "*"});
    const requestOptions = { headers: headers };
    this.http.get<any>("http://localhost:5000/HW").subscribe(data => {
      console.log(data)});
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 
}

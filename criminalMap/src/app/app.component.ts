import { Component } from '@angular/core';
import * as Leaflet from 'leaflet';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

interface dataInterface {
  CATEGORIE: string;
  DATE: Date;
  QUART: string;
  PDQ: string;
  LONGITUDE: number;
  LATITUDE: number;
  PDQ_NOM: string;
  OUTLIERFLAG: boolean;
  ICON: string;
}

var dataFinal: dataInterface[] = []
var dataFiltered: dataInterface[] = []

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

  generateMarker(data: any, index: number) {
    const icon = Leaflet.icon({
      iconUrl: data.icon, 
      iconSize: [20, 20]
    })
    let marker = Leaflet.marker(data.position,{icon: icon} )
    .on('click', (event) => this.markerClicked(event, index))
    this.markers.push(marker);
    return marker;
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    console.log("asda")
    const headers = new HttpHeaders({"Access-Control-Allow-Origin": "*"});
    const requestOptions = { headers: headers };
    this.http.get<any>("http://localhost:5000/HW").subscribe(data => {
      this.InitMarkerData(data)});
  }
  
  InitMarkerData(data: any){
    data = Object.values(data)[0];
    const sizeData: number = data.length
    for (let i = 1; i < data.length; i++) {

      let incidentIcon = "../assets/gun.png";
      switch(data[i][0]) { 
        case 'Vol de véhicule à moteur': { 
          incidentIcon = "../assets/car_thief.png";
           break; 
        } 
        case 'Méfait': { 
          incidentIcon = "../assets/profanity.png";
           break; 
        } 
        case 'Vol dans / sur véhicule à moteur': { 
          incidentIcon = "../assets/car.png";
          break; 
        } 
        case 'Introduction': { 
          incidentIcon = "../assets/house_thief.png";
          break; 
        } 
        case 'Vols qualifiés': { 
          incidentIcon = "../assets/robbery_knife.png";
          break; 
        } 
        case 'Infractions entrainant la mort': { 
          incidentIcon = "../assets/skull.png";
          break; 
        } 
      } 
      
      let dataElement: dataInterface = {
        CATEGORIE: data[i][0],
        DATE: data[i][1],
        QUART: data[i][2],
        PDQ: data[i][3],
        LONGITUDE: data[i][6],
        LATITUDE: data[i][7],
        PDQ_NOM: data[i][8],
        OUTLIERFLAG: data[i][10],
        ICON: incidentIcon
      };
      dataFinal.push(dataElement);
    }
    dataFiltered = dataFinal
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    var dataInitial: dataInterface[] = []
    this.filterDayMonth(currentYear,currentMonth)
  }

  prepareMarkers(dataToMark: dataInterface[]) {
    for (let index = 0; index < dataToMark.length; index++) {
      let dataMarker = 
        {
          position: { lat: dataToMark[index].LATITUDE, lng: dataToMark[index].LONGITUDE },
          icon:dataToMark[index].ICON,
          category:dataToMark[index].CATEGORIE,
          date:dataToMark[index].DATE,
          time:dataToMark[index].QUART
        };
        const marker = this.generateMarker(dataMarker, index);
        marker.addTo(this.map).bindPopup(`<b>${dataMarker.category} le ${dataMarker.date} de ${dataMarker.time}</b>`);
        this.map.panTo(dataMarker.position);
        this.markers.push(marker)
    }
  }
  toggleCarThief = true;
  toggleMefait = true;
  toggleCar = true;
  toggleHouseThief = true;
  toggleThief = true;
  toggleDead = true;
  toggleAbberant = true;

  test(e: Event){
    switch ((e.target as HTMLImageElement).id){
      case 'car_thief': { 
          this.toggleCarThief =!this.toggleCarThief;
          this.markers.forEach((e) => {
            e.remove();
          })
           break; 
        } 
        case 'mefait': { 
          this.toggleMefait =!this.toggleMefait;
           break; 
        } 
        case 'car': { 
          this.toggleCar =!this.toggleCar;
          break; 
        } 
        case 'house_thief': { 
          this.toggleHouseThief =!this.toggleHouseThief;
          break; 
        } 
        case 'thief': { 
          this.toggleThief =!this.toggleThief;
          break; 
        } 
        case 'dead': { 
          this.toggleDead =!this.toggleDead;
          break; 
        } 
        case 'abberant': {
          this.toggleAbberant =!this.toggleAbberant;
          break;
        }
    }
    
  }

  filterQuarter(quarter: string){
    var dataInitial: dataInterface[] = []
    for (let i = 0; i < dataFinal.length; i++) {
      if(dataFinal[i].QUART == quarter)
        dataInitial.push(dataFinal[i]);
    }
    dataFiltered = dataFinal
    this.prepareMarkers(dataInitial)
  }
  
  filterDayMonth(year: number, month: number){
    var dataInitial: dataInterface[] = []
    for (let i = 0; i < dataFinal.length; i++) {
      if(new Date(dataFinal[i].DATE).getFullYear() == year && new Date(dataFinal[i].DATE).getMonth()+1 == month)
        dataInitial.push(dataFinal[i]);
    }
    dataFiltered = dataFinal
    this.prepareMarkers(dataInitial)
  }

  filterCategoryIn(category: string){
    for (let i = 0; i < dataFinal.length; i++) {
      if(dataFinal[i].CATEGORIE == category)
        dataFiltered.push(dataFinal[i]);
    }
    this.prepareMarkers(dataFiltered)
  }

  filterCategoryOut(category: string){
    for (let i = 0; i < dataFiltered.length; i++) {
      if(dataFiltered[i].CATEGORIE == category)
        dataFiltered.splice(i,1);
    }
    this.prepareMarkers(dataFiltered)
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

  InitMarkerDataOutliers(data: any){

    var dataFinal: dataInterface[] = []
    data = Object.values(data)[0];
    const sizeData: number = data.length
    for (let i = 1; i < data.length; i++) {
      if(data[i][10] == 'True'){
        let incidentIcon = "../assets/robbery_soft.png";
        let dataElement: dataInterface = {
          CATEGORIE: data[i][0],
          DATE: data[i][1],
          QUART: data[i][2],
          PDQ: data[i][3],
          LONGITUDE: data[i][6],
          LATITUDE: data[i][7],
          PDQ_NOM: data[i][8],
          OUTLIERFLAG: data[i][10],
          ICON: incidentIcon
        };
        dataFinal.push(dataElement);
      }
    }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    var dataInitial: dataInterface[] = []
    this.prepareMarkers(dataInitial)
  }
}

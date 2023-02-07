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
  OUTLIERFLAG: string;
  ICON: string;
}

var dataFinal: dataInterface[] = []

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
  toggleCarThief = true;
  toggleMefait = true;
  toggleCar = true;
  toggleHouseThief = true;
  toggleThief = true;
  toggleDead = true;
  toggleAbberant = false;
  year=2023;
  month=1;
  toggleEvening = true;
  toggleNight = true;
  toggleDay = true;

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

    this.updateMap();
  }

  prepareMarkers(dataToMark: dataInterface[]) {
    for (let index = 0; index < dataToMark.length; index++) {
      let appendData = false;
      switch(dataToMark[index].CATEGORIE) { 
        case 'Vol de véhicule à moteur': { 
          appendData = this.toggleCarThief;
           break; 
        } 
        case 'Méfait': { 
          appendData = this.toggleMefait;
           break; 
        } 
        case 'Vol dans / sur véhicule à moteur': { 
          appendData = this.toggleCar;
          break; 
        } 
        case 'Introduction': { 
          appendData = this.toggleHouseThief;
          break; 
        } 
        case 'Vols qualifiés': { 
          appendData = this.toggleThief;
          break; 
        } 
        case 'Infractions entrainant la mort': { 
          appendData = this.toggleDead;
          break; 
        } 
      }
      switch(dataToMark[index].QUART) { 
        case 'jour':{
          appendData = this.toggleDay;
          break;
        }
        case 'soir':{
          appendData = this.toggleEvening;
          break;
        }
        case 'nuit':{
          appendData = this.toggleNight;
          break;
        }
      }
      let icon = dataToMark[index].ICON;
      if (this.toggleAbberant && dataToMark[index].OUTLIERFLAG == "True"){        
        icon = "../assets/red-flag.png";
        appendData = true;
      }
      if (appendData){
        let dataMarker = 
          {
            position: { lat: dataToMark[index].LATITUDE, lng: dataToMark[index].LONGITUDE },
            icon:icon,
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
  }

  dateChanged(){
    let str = (document.getElementById("YM") as HTMLInputElement).value;
    let MMYY = str.split('-');
    console.log(MMYY);
    if(+MMYY[0] > 2023 && +MMYY[1] > 12) return;
    this.year = +MMYY[0];
    this.month = +MMYY[1];
    this.updateMap()
  }
  
  updateMap(){
    this.markers.forEach((e) => {
      e.remove();
    })
    this.filterDayMonth();
  }

  setAllOpposite(value: boolean){
    this.toggleCar = !value;
    this.toggleCarThief = !value;
    this.toggleHouseThief = !value;
    this.toggleDead = !value;
    this.toggleMefait = !value;
    this.toggleThief = !value;
  }


  filterTimeOfDay(e: Event){
    switch ((e.target as HTMLImageElement).id){
      case 'day': { 
          this.toggleDay =!this.toggleDay;
          break; 
        } 
        case 'evening': { 
          this.toggleEvening =!this.toggleEvening;
          break; 
        } 
        case 'night': { 
          this.toggleNight =!this.toggleNight;
          break; 
        } 
    }
    this.updateMap();
  }

  filterCategory(e: Event){
    switch ((e.target as HTMLImageElement).id){
      case 'car_thief': { 
          this.toggleCarThief =!this.toggleCarThief;
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
          this.setAllOpposite(this.toggleAbberant);
          break;
        }
    }
    this.updateMap();
  }
  
  filterDayMonth(){
    var dataInitial: dataInterface[] = []
    let monthIteraton: number;
    let yearIteration: number;
    for (let i = 0; i < dataFinal.length; i++) {
      monthIteraton = Number(new Date(dataFinal[i].DATE).getMonth()+1);
      yearIteration = Number(new Date(dataFinal[i].DATE).getFullYear());
      if(yearIteration == this.year && monthIteraton == this.month){
        dataInitial.push(dataFinal[i]);
      }
    }
    this.prepareMarkers(dataInitial)
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
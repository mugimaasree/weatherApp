import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { SharedService } from '../shared.service';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map!: L.Map;
  marker!: L.Marker;

  constructor(private shareService: SharedService,private weatherService:WeatherService) {}

  ngOnInit(): void {
    this.shareService.getLocation().subscribe(location => {
      if (location) {
        this.searchLocationOnMap(location);
      }
    });

    this.initializeMap();
  }

  initializeMap(): void {
    if (!this.map) {
      this.map = L.map('map').setView([51.505, -0.09], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

  searchLocationOnMap(location: string): void {
    if (location) {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;

      fetch(geocodingUrl)
        .then(response => response.json())
        .then(data => {
          const latitude = data.results[0].latitude;
          const longitude = data.results[0].longitude;
          if (this.marker) {
            this.map.removeLayer(this.marker);
          }
          
          const customIcon = L.icon({
            iconUrl: 'assets/images/pic22.png',
            iconSize: [30, 30],
          });
  
          this.marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(this.map!);
          const coordinates = [latitude, longitude];

          this.weatherService.getTemperature(coordinates[0], coordinates[1], '2023-08-01', '2023-08-07')
          .subscribe((temperatureData: any) => {
            const temperature = temperatureData.hourly.temperature_2m[0];
            const popupContent = `${location}<br>Temperature: ${temperature}&#176;C`;
            if (this.marker) {
              this.marker.bindPopup(popupContent).openPopup();
            }
          });

          this.map.setView([latitude, longitude], 13);
        })
        .catch(error => {
          console.error('Error fetching geocoding data:', error);
        });
    }
  } 
}

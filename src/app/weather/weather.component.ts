import { Component } from '@angular/core';
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {

  weekDates : Date[] = [];
  Days :any[] = [];
  location:string = '';
  latitude:number=0;
  longitude:number=0;
  temperatureData: any = {}; 
  leftData: any = {}; 
  weatherData: any = {};
  startDate: string=''; 
  endDate: string='';
  currentDate:Date = new Date();

  constructor(private sharedService:SharedService,private weatherService: WeatherService) {
    this.calculateWeekDates();
    this.setInitialDateRange();
  }

  calculateWeekDates() {
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      this.weekDates.push(nextDate);
    }
  }
  
  setInitialDateRange() {
    this.startDate = this.currentDate.toISOString().substr(0, 10);
    const endDate = new Date(this.currentDate);
    endDate.setDate(endDate.getDate() + 6);
    this.endDate = endDate.toISOString().substr(0, 10);
    this.weather();
  }

  weather() {
    const startingDate = new Date(this.startDate);
    const endingDate = new Date(this.endDate);
    const daysDifference = Math.floor((endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference >= 0 && daysDifference <= 6) {
      this.weatherService.getTemperature(this.latitude, this.longitude, this.startDate, this.endDate).subscribe(data => {
        this.temperatureData = data;
        this.BoxData();
        console.log(data);
      });
    } else {
      this.showAlert();
    }
  }

  BoxData() {
    this.Days = [];

    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);

    if (startDate > endDate) {
      console.error('Start date is after end date');
      return;
    }

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
    const currentDayData = this.getTemperatureDataForDay(currentDate);
    this.Days.push({
      date: currentDate.toDateString(),
      ...currentDayData,
    });
      currentDate = this.nextDate(currentDate);
    }
  }

  nextDate(currentDate: Date): Date {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);
    return nextDay;
  }

  getTemperatureDataForDay(date: Date): any {
    const times = Math.floor(date.getTime() / 1000);
    const index = this.temperatureData.hourly.time.indexOf(times);
  
    if (index !== -1) {
      return {
        date: date.toDateString(),
        temperature: this.temperatureData.hourly.temperature_2m[index],
        humidity: this.temperatureData.hourly.relativehumidity_2m[index],
      };
    } else {
      return {
        date: date.toDateString(),
        temperature: null,
        humidity: null,
      };
    }
  }

  showAlert() {
    alert('Only a 7-day date range is allowed.');
  }

  ngOnInit() {
    this.sharedService.getLocation().subscribe((location) => {
      this.location = location;
  
      if (location) {
        this.weatherService.getWeather(location, 10).subscribe(
          (res: any) => {
            this.leftData = res;
            if (res.results && res.results[0]) {
              const latitude = res.results[0].latitude;
              const longitude = res.results[0].longitude;
              this.weatherService.getTemperature(latitude, longitude, this.startDate, this.endDate).subscribe(
                (response: any) => {
                  this.temperatureData = response;
                  this.BoxData();
                },
                (error: any) => {
                  console.log('Error fetching temperature data:', error);
                }
              );
            }
          }
        );
      }
    });
  }
}

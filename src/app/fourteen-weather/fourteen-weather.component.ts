import { Component } from '@angular/core';
import { SharedService } from '../shared.service';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-fourteen-weather',
  templateUrl: './fourteen-weather.component.html',
  styleUrls: ['./fourteen-weather.component.css']
})
export class FourteenWeatherComponent {
  weekDates : Date[] = [];
  Days :any[] = [];
  location:string = '';
  latitude:number=0;
  longitude:number=0;
  temperatureData: any = {}; 
  weatherData: any = {};
  startDate='';
  endDate='';
  leftData:any={};
  currentDate:Date = new Date();

    constructor(private shareService:SharedService,private weatherService: WeatherService) {
    this.calculateWeekDates();
    this.setInitialDateRange();
  }
  
  setInitialDateRange() {
    this.startDate = this.currentDate.toISOString().substr(0, 10);
    const endDate = new Date(this.currentDate);
    endDate.setDate(endDate.getDate() + 13);
    this.endDate = endDate.toISOString().substr(0, 10);
    this.weather();
  }

  calculateWeekDates() {
    const currentDate = new Date();
    for (let i = 0; i < 14; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      this.weekDates.push(nextDate);
    }
  }
  
  weather() {
    const startingDate = new Date(this.startDate);
    const endingDate = new Date(this.endDate);
    
    const daysDifference = Math.floor((endingDate.getTime() - startingDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference >= 0 && daysDifference <= 13) {
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
    alert('Only a 14-day date range is allowed.');
  }

  ngOnInit() {
    this.shareService.getLocation().subscribe((location) => {
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
                  this.BoxData(); // Fetch data for the initial date range
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
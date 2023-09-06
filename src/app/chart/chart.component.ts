import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  temperatureData: number[] = [];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  temperatureDates: string[] = [];
  currentDay: string = '';

  constructor(private weatherService: WeatherService, private sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.getLocation().subscribe(location => {
      
    });

    this.sharedService.getTemperatureData().subscribe(data => {
      this.temperatureData = data?.hourly?.temperature_2m?.slice(0, 7) || [];
      this.setTemperatureDates();
    });

    this.setCurrentDay();
  }

  setTemperatureDates() {
    const currentDate = new Date();
    const next7Days: string[] = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() + i);
      next7Days.push(`${this.days[day.getDay()]} - ${day.toISOString().split('T')[0]}`);
    }

    this.temperatureDates = next7Days;
  }

  setCurrentDay() {
    const today = new Date();
    this.currentDay = this.days[today.getDay()];
  }

  getDayOfWeek(dateString: string): string {
    const date = new Date(dateString.split(' - ')[1]);
    return this.days[date.getDay()];
  }

  getDate(dateString: string): string {
    return dateString.split(' - ')[1];
  }
}
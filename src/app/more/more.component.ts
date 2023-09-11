import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {
  location:string = 'Thenkasi';
  temperatureData:any={};
  weatherData:any={};
  isLoading = false;


  constructor(private sharedService: SharedService) { }

    ngOnInit(): void {
      this.sharedService.getTemperatureData().subscribe((data: any) => {
        this.temperatureData = data;
      });
      this.isLoading = true;

    // Simulate a delay (replace this with your actual API call)
    setTimeout(() => {
      // Once data is received and processed, set isLoading back to false
      this.isLoading = false;
    }, 500); // Simulated 2-second delay
  
    }
    formatTime(timeString: string): string {
      if (!timeString) return '';

    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  }
}
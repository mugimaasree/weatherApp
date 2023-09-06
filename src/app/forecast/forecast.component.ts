import { Component, OnInit} from '@angular/core';
import { WeatherService } from '../weather.service';
import { SharedService } from '../shared.service'; 
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit{
  
  location:string = 'Thenkasi';
  weatherData: any;
  latitude:number=0;
  longitude:number=0;
  temperatureData:any={};
  date=new Date();
  filter:any[]=[];
  selectedCity: any;
  count:any[]=[];
  selectedSuggestionIndex= -1;
  showError:boolean=false;
  showList:boolean=true;
  startDate=new Date().toISOString().split('T')[0];
  endDate=new Date().toISOString().split('T')[0];
  
  constructor(private weatherservice: WeatherService,private sharedService: SharedService) { }
    ngOnInit(): void {
      this.startDate = this.getFormattedDate(new Date()); 
      this.endDate = this.getFormattedDate(new Date()); 
      this.search();
    }
    
    getFormattedDate(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      console.log(date);
        return `${year}-${month}-${day}`;
      }
      
      search() {
        if(this.location.trim()==='') {
          this.showError=true;
            return;
        }
        this.showError=false;
        this.weatherservice.getWeather(this.location,10).subscribe(res => {
        this.weatherData = res;
        console.log("WeatherData:", res);
          if (res.results && res.results[0] ) {
            this.latitude = res.results[0].latitude;
            this.longitude = res.results[0].longitude;
            console.log('Current Location:', this.location);
            
            this.sharedService.setLocation(this.location); 
            this.weatherservice.getTemperature(this.latitude, this.longitude,this.startDate,this.endDate).subscribe(response => {
                this.temperatureData = response;
                this.location = this.weatherData.results[0].name;
                this.sharedService.setTemperatureData(this.temperatureData);
                this.sharedService.setWeatherData(res);
                console.log('Temperature Data:', response);
                console.log('Updated Location:', this.location);
              });
          }
        });
      }
        
    changePlace(value:string) {
      if(value.trim()=== '') {
        this.filter = [];
      }
        this.weatherservice.getWeather(value,10).subscribe(response => {
          this.filter=response.results;
        });
      }
      
    searchButton() {
      this.sharedService.setLocation(this.location);
      this.showList=false;
      this.search();
    }
      
    getWeatherDescription(weatherCode: number): string {
    
          switch(weatherCode) {
            case 0:
              return 'Clear sky';
            case 1:
              return 'Mainlyclear';
            case 2:
              return 'partlycloudy';
            case 3:
              return 'overcast';
            case 45:
              return 'Fog';
            case 48:
              return 'depositing rime fog';
            case 51:
              return 'Drizzle: Light';
            case 53:
              return  'moderate';
            case 55:
              return 'dense intensity';
            case 56:
              return 'Freezing Drizzle: Light';
            case 57:
              return 'dense intensity';
            case 61:
              return 'Rain: Slight';
            case 63:
              return 'moderate';
            case 65:
              return 'heavy intensity';
            case 66:
              return 'Freezing Rain: Light';
            case 67:
              return 'heavy intensity';
            case 71:
              return 'Snow fall: Slight';
            case 73:
              return 'moderate';
            case 75:
              return 'heavy intensity';
            case 77:
              return 'Snow grains';
            case 80:
              return 'Rain showers: Slight';
            case 81:
              return 'moderate';
            case 82:
              return  'violent';
            case 85:
              return 'Snow showers slight';
            case 86:
              return 'heavy';
            case 95:
              return 'Thunderstorm: Slight or moderate';
            case 96:
              return 'Thunderstorm with slight';
            case 99:
              return 'heavy hail';
            }
            return 'unknown';
      }

      onLocationChange(value: string) {
        if (value.trim() === '') {
          this.filter = [];
          this.showList = false;
          this.selectedSuggestionIndex=-1; 
        } else {
          this.weatherservice.getWeather(value, 10).subscribe(response => {
            this.filter = response.results;
            this.showList = true; 
            this.selectedSuggestionIndex=-1;
          });
        }
      }
          selectCity(filter:any) {
            this.location = filter.name;
            this.selectedCity = filter;
            this.filter=[];
            this.showList=false;
            this.search();
            this.selectedSuggestionIndex=-1;
            this.sharedService.setLocation(this.location);
          }
         
          onKeyDown(event: KeyboardEvent) {
      console.log('Key pressed:', event.key);
      
            if (event.key === 'Enter') {
              this.onEnterKey();
            } else if (event.key === 'ArrowUp') {
              this.moveSelection(-1);
            } else if (event.key === 'ArrowDown') {
              this.moveSelection(1);
            }
          }
        
          moveSelection(step: number) {
            const newIndex = this.selectedSuggestionIndex + step;
            if (newIndex >= 0 && newIndex < this.filter.length) {
              this.selectedSuggestionIndex = newIndex;
            }
          }
        
          onEnterKey() {
            if (this.selectedSuggestionIndex !== -1) {
              this.selectCity(this.filter[this.selectedSuggestionIndex]);
              this.showList = false;
              this.selectedSuggestionIndex = -1;
              console.log('enter the key pressed');
            } else {
              this.searchButton();
            }
            this.showList=false;
          }
         
          onClickOutside() {
            this.showList=false;
            this.selectedSuggestionIndex=-1;
          }
          clearLocation() {
            this.location = '';
          }

          getWeatherImage(): string {
            if (this.weatherData && this.temperatureData) {
              const weatherCode = this.temperatureData?.current_weather?.weathercode;
              const temperature = this.temperatureData?.current_weather?.temperature;
              
              if (weatherCode === 0) {
              
                return 'assets/images/pic2.jpg';
              } else if (weatherCode === 1) {
              
                return 'assets/images/pic3.jpg';
              } else if (temperature < 10) {
                
                return 'assets/images/pic4.jpg';
              } else {
                
                return 'assets/images/pic5.jpg';
              }
            }
            return 'assets/images/pic5.jpg'; 
          }

          getWeatherIcon(weatherCode: number): string {
            const iconBaseUrl = 'http://openweathermap.org/img/wn/';
          
            switch (weatherCode) {
              case 0:
                return iconBaseUrl + '01d@2x.png';
              case 1:
                return iconBaseUrl + '01d@2x.png';
              case 2:
                return iconBaseUrl + '02d@2x.png';
              case 3:
                return iconBaseUrl + '02d@2x.png';
              case 51:
                return iconBaseUrl + '10d@2x.png'; 
              case 56:
                return iconBaseUrl + '10d@2x.png'; 
              case 61:
                return iconBaseUrl + '10d@2x.png';
              case 95:
                return iconBaseUrl + '11d@2x.png';
              case 96:
                return iconBaseUrl + '11d@2x.png';
              default:
                return iconBaseUrl + '01d@2x.png';
            }
          }
        
}
         
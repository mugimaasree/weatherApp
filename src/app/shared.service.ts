import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private temperatureDataSubject = new BehaviorSubject<any>({});
  private weatherData: any = {};
  private locationSubject = new BehaviorSubject<string>('');
  
  setTemperatureData(data: any) {
    this.temperatureDataSubject.next(data);
  }

  getTemperatureData(): Observable<any> {
    return this.temperatureDataSubject.asObservable();
  }

  setWeatherData(data: any) {
    this.weatherData = data;
  }

  getWeatherData() {
    return this.weatherData;
  }

  setLocation(location: string) {
    this.locationSubject.next(location);
  }

  getLocation(): Observable<string> {
    return this.locationSubject.asObservable();
  }
}
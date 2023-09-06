import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';
import { ForecastComponent } from './forecast/forecast.component';
import { MapComponent } from './map/map.component';
import { ChartComponent } from './chart/chart.component';
import { FourteenWeatherComponent } from './fourteen-weather/fourteen-weather.component';
import { MoreComponent } from './more/more.component';

const routes: Routes = [{ path: 'home', component:ForecastComponent},

{ path: 'weather', component: WeatherComponent },
{ path: 'map', component: MapComponent },
{ path: 'chart', component: ChartComponent },
{ path: 'fourteen', component: FourteenWeatherComponent },
{ path: 'More', component: MoreComponent },


{ path: '', redirectTo: '/weather', pathMatch: 'full' },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

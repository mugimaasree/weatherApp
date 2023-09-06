import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourteenWeatherComponent } from './fourteen-weather.component';

describe('FourteenWeatherComponent', () => {
  let component: FourteenWeatherComponent;
  let fixture: ComponentFixture<FourteenWeatherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FourteenWeatherComponent]
    });
    fixture = TestBed.createComponent(FourteenWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

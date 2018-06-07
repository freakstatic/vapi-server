import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelapsesComponent } from './timelapses.component';

describe('TimelapsesComponent', () => {
  let component: TimelapsesComponent;
  let fixture: ComponentFixture<TimelapsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelapsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelapsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

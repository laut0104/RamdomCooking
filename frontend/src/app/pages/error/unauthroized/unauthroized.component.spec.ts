import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthroizedComponent } from './unauthroized.component';

describe('UnauthroizedComponent', () => {
  let component: UnauthroizedComponent;
  let fixture: ComponentFixture<UnauthroizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnauthroizedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthroizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

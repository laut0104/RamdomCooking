import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiffInitComponent } from './liff-init.component';

describe('LiffInitComponent', () => {
  let component: LiffInitComponent;
  let fixture: ComponentFixture<LiffInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiffInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiffInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

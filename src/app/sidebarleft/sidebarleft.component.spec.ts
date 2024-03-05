import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarleftComponent } from './sidebarleft.component';

describe('SidebarleftComponent', () => {
  let component: SidebarleftComponent;
  let fixture: ComponentFixture<SidebarleftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarleftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarleftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

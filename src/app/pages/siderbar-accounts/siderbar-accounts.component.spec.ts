import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiderbarAccountsComponent } from './siderbar-accounts.component';

describe('SiderbarAccountsComponent', () => {
  let component: SiderbarAccountsComponent;
  let fixture: ComponentFixture<SiderbarAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiderbarAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiderbarAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

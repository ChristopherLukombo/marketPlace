import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseDialogSuccessComponent } from './house-dialog-success.component';

describe('HouseDialogSuccessComponent', () => {
  let component: HouseDialogSuccessComponent;
  let fixture: ComponentFixture<HouseDialogSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseDialogSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseDialogSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

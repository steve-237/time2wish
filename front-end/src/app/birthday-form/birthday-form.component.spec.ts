import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayFormComponent } from './birthday-form.component';

describe('BirthdayFormComponent', () => {
  let component: BirthdayFormComponent;
  let fixture: ComponentFixture<BirthdayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdayFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

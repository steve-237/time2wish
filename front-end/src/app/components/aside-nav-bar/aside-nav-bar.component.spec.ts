import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideNavBarComponent } from './aside-nav-bar.component';

describe('AsideNavBarComponent', () => {
  let component: AsideNavBarComponent;
  let fixture: ComponentFixture<AsideNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideNavBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

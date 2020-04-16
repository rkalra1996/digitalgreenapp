import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BestpracticesComponent } from './bestpractices.component';

describe('BestpracticesComponent', () => {
  let component: BestpracticesComponent;
  let fixture: ComponentFixture<BestpracticesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestpracticesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BestpracticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

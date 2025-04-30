import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockListViewComponent } from './stock-list-view.component';

describe('StockListViewComponent', () => {
  let component: StockListViewComponent;
  let fixture: ComponentFixture<StockListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { StockListViewComponent } from './stock-list-view/stock-list-view.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'stock-predictor-app';
}

import { Routes } from '@angular/router';
import { StockListViewComponent } from './stock-list-view/stock-list-view.component';
import { StockDetailsComponent } from './stock-details/stock-details.component';

export const routes: Routes = [
    {path: '', redirectTo: 'stock-list', pathMatch: 'full'},
    {path: 'stock-list', component: StockListViewComponent},
    {path: 'stock-details', component: StockDetailsComponent},
];

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { StockEntry } from '../models/stock-entry.model';

@Injectable({
  providedIn: 'root'
})

export class StockService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }


  getStockNames(category: string) {
    const url = `${this.baseUrl}/stock/category/${category}`;
    return this.http.get<any[]>(url);
  }

  getStockData() {
    const url = `${this.baseUrl}/stock/data`;
    return this.http.get<any>(url)
  }
  
  // getStockData(ticker: string, date: string) {
  //   const url = `${this.baseUrl}/stock/data/${ticker}+${date}`;
  //   return this.http.get<any>(url)
  // }


}

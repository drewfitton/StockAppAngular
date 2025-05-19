import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { StockEntry } from '../models/stock-entry.model';
import { Observable } from 'rxjs';
import { PaginatedStockResponse } from '../models/paginated-stock-response';
import { StockReturnsResponse } from '../models/stock-returns-response';

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

  getStockReturns(category: string, period: string): Observable<StockReturnsResponse> {
    let params = new HttpParams()
      .set('category', category)
      .set('period', period);

    return this.http.get<StockReturnsResponse>(`${this.baseUrl}/stock/all_returns/`, { params })
  }
  
  getPaginatedStocks(
    category: string,
    period: string,
    returns_period: string,
    inds: string[],
    offset: number,
    limit: number,
    sort: string = 'returns_desc'
  ): Observable<PaginatedStockResponse> {
    let params = new HttpParams()
      .set('category', category)
      .set('period', period)
      .set('returns_period', returns_period)
      .set('offset', offset)
      .set('limit', limit)
      .set('sort', sort);

    inds.forEach(ind => {
      params = params.append('inds', ind);
    });

    return this.http.get<PaginatedStockResponse>(`${this.baseUrl}/stock/data/`, { params });
  }
  
  // getStockData(ticker: string, date: string) {
  //   const url = `${this.baseUrl}/stock/data/${ticker}+${date}`;
  //   return this.http.get<any>(url)
  // }


}

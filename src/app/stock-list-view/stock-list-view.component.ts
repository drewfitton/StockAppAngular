import { Component, OnInit } from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../services/stock.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ViewChild } from '@angular/core';
import { calculateStartDate } from '../utils/date-utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js';
import { StockCardComponent } from '../stock-card/stock-card.component';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-stock-list-view',
  standalone: true,
  imports: [CommonModule, StockCardComponent],
  templateUrl: './stock-list-view.component.html',
  styleUrl: './stock-list-view.component.css'
})
export class StockListViewComponent { // implements OnInit {
  stock_data: StockEntry[] = [];
  filtered_data: StockEntry[] = [];
  stock_names: { [key: string]: string } = {};
  selectedDate: string  = '2025-01-01';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  timePeriods: string[] = ["5D", "1M", "6M", "YTD", "1Y", "5Y"];
  selectedPeriod: string = "YTD"; // Default selected, like "1 Month"
  categoryOptions = [
    'All', 'Tech', 'Finance', 'Healthcare',
    'Startups', 'Retail', 'Sports', 'Energy', 'Entertainment'
  ];
  selectedCategory: string = 'All'; // Default selected category
  dropdownOpen = false;

  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Adjusted Close Price',
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1
      }
    ]
  };
  
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  constructor(private fb: FormBuilder, private stockService: StockService, private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    // this.loadStockData();
    this.loadStockNames();
  }

  loadStockNames(): void {
    this.stockService.getStockNames(this.selectedCategory).subscribe({
      next: (data: any) => {
        this.stock_names = data;
        // this.filtered_data = this.stock_data.filter(entry => {
        //   return Object.keys(this.stock_names).includes(entry.ticker);
        // });
        // console.log('Stock names:', this.stock_names);
      },
      error: (err: string) => {
        console.error('Error fetching stock names:', err);
      }
    });
  }

  get stockList(): { key: string; name: string }[] {
    return Object.entries(this.stock_names).map(([key, name]) => ({ key, name }));
  }

  loadStockData(ticker: string, date: string): void {
    this.stockService.getStockData(ticker, date).subscribe({
      next: (data: StockEntry[]) => {
        this.stock_data = data;
        this.filtered_data = data;
        // console.log('Stock data:', this.stock_data[0]);
      },
      error: (error: string) => {
        console.error('Error fetching stock data', error);
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onSelectCategory(option: string) {
    this.selectedCategory = option;
    this.dropdownOpen = false;
    // You can emit this if you need to notify parent components
    this.loadStockNames();
  }

  onSelectPeriod(period: string) {
    this.selectedPeriod = period;
    console.log('Selected:', period);
    // Optionally, fetch new data / update chart here!
    this.selectedDate = calculateStartDate(period).toISOString().split('T')[0];

  }

}

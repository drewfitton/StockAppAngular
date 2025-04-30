import { Component, OnInit } from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../services/stock.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ViewChild } from '@angular/core';
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
  selector: 'app-stock-details',
  imports: [CommonModule, ReactiveFormsModule, BaseChartDirective],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css'
})
export class StockDetailsComponent {
  stock_data: StockEntry | null = null;
  stockForm!: FormGroup;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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
    this.stockForm = this.fb.group({
      ticker: ['', [Validators.required]],
      date: ['', [Validators.required]]
    });
  }

  // loadData(ticker: string, date: string): void {
  //   this.stockService.getStockData(ticker, date).subscribe({
  //     next: (data: any) => {
  //       this.stock_data = data;
  //     },
  //     error: (err: string) => {
  //       console.error('Error fetching stock data:', err);
  //     }
  //   });
  // }
  loadData(ticker: string, date: string): void {
    this.stockService.getStockData(ticker, date).subscribe({
      next: (data: any) => {
        this.stock_data = data;

        this.chartData.labels = data.date;
        this.chartData.datasets[0].data = data.adj_close;
        this.chart?.update();
      },
      error: (err: string) => {
        console.error('Error fetching stock data:', err);
      }
    });
  }

  get ticker() {
    return this.stockForm.get('ticker');
  }

  get date() {
    return this.stockForm.get('date');
  }

  onSubmit(): void {
    if (this.stockForm.valid) {
      const ticker = this.stockForm.value.ticker;
      const date = this.stockForm.value.date;
      this.loadData(ticker, date);
      // this.stockForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}

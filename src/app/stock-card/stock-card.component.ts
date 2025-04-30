import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { StockService } from '../services/stock.service';

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
  selector: 'app-stock-card',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.css'
})
export class StockCardComponent {
  @Input() date: string | null = "2025-01-01";
  @Input() stockEntry: StockEntry | null = null;
  @Output() stockSelected = new EventEmitter<StockEntry>();
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  stock_entry: StockEntry | null = null;
  loadingChart = true; 

  public chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Adjusted Close Price',
        fill: false,
        borderColor: this.getBorderColor(),
        tension: 0.1,
        pointRadius: 0,          // hide points
        pointHoverRadius: 6,     // show on hover
        pointHitRadius: 10,  
      }
    ]
  };

  private getBorderColor(): string {
    if (this.stockEntry) {
      return this.stockEntry.returns !== null && this.stockEntry.returns < 0 ? 'red' : 'green';
    } else {
      return 'rgba(75,192,192,1)'; // Default color
    }
  }
  
  public chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(private router: Router, private stockService: StockService) { }

  ngOnInit() {
    this.loadData()
    // console.log("Stock card data:", this.stockEntry);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date'] && !changes['date'].firstChange) {
      // console.log('Date input changed for', this.stockEntry!.ticker, 'to', this.date);
      this.loadData();
    }
  }
  
  onSelectStock(stock: StockEntry) {
    this.stockSelected.emit(stock);
    this.router.navigate(['/stock-details'], { queryParams: { stockName: stock.ticker } });
  }
  
  loadData() {
    if (this.stockEntry) {
      this.loadingChart = true; // Set loading state to true before chart loads
      this.chartData.labels = this.stockEntry.date;
      this.chartData.datasets[0].data = this.stockEntry.adj_close;
      this.chartData.datasets[0].borderColor = this.getBorderColor();
      this.chart?.update();
      this.loadingChart = false; 
    }
  }

}

import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { Router } from '@angular/router';
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
  imports: [BaseChartDirective],
  templateUrl: './stock-card.component.html',
  styleUrl: './stock-card.component.css'
})
export class StockCardComponent {
  @Input() date: string | null = "2025-01-01";
  @Input() stockEntry: StockEntry | null = null;
  @Output() stockSelected = new EventEmitter<StockEntry>();
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  stock_entry: StockEntry | null = null;
  returns: number | null = null;

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
    return this.returns !== null && this.returns < 0 ? 'red' : 'green';
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

  // loadData() {
  //   if (this.stockEntry) {
  //     this.returns = Math.round(((this.stockEntry.adj_close[this.stockEntry.adj_close.length - 1] - this.stockEntry.adj_close[0]) / this.stockEntry.adj_close[0]) * 10000) / 100;
  //     this.chartData.labels = this.stockEntry.date;
  //     this.chartData.datasets[0].data = this.stockEntry.adj_close;
  //     this.chartData.datasets[0].borderColor = this.getBorderColor();
  //     this.chart?.update();
  //   }
  // }
  loadData() {
    if (this.stockEntry && this.stockEntry.date.length > 0 && this.date) {
      const dateIndex = this.stockEntry.date.findIndex(d => d >= this.date!);
  
      // If no date found (i.e., all dates are before the input), return early
      if (dateIndex === -1) {
        this.chartData.labels = [];
        this.chartData.datasets[0].data = [];
        this.returns = null;
        this.chart?.update();
        return;
      }
  
      // Slice arrays from the found index onward
      const filteredDates = this.stockEntry.date.slice(dateIndex);
      const filteredAdjClose = this.stockEntry.adj_close.slice(dateIndex);
  
      // Calculate returns
      if (filteredAdjClose.length > 1) {
        this.returns = Math.round(((filteredAdjClose[filteredAdjClose.length - 1] - filteredAdjClose[0]) / filteredAdjClose[0]) * 10000) / 100;
      } else {
        this.returns = 0;
      }
      // console.log("dates:", filteredDates);
      // console.log("close: ", filteredAdjClose)
      // Update chart
      this.chartData.labels = filteredDates;
      this.chartData.datasets[0].data = filteredAdjClose;
      this.chartData.datasets[0].borderColor = this.getBorderColor();
      this.chart?.update();
    }
  }

}

import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import { ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Chart,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { StockService } from '../services/stock.service';
import 'chartjs-adapter-date-fns'; // ⬅️ this is what registers 'time' scale support

// Register necessary Chart.js components
Chart.register(
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
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



  mainChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  rsiChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  macdChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  mainChartOptions: ChartConfiguration<'line'>['options'] = {responsive: true, plugins: { legend: { display: true, }, }, };
  rsiChartOptions: ChartConfiguration<'line'>['options'] = {responsive: true, plugins: { legend: { display: true, }, }, };
  macdChartOptions: ChartConfiguration<'line'>['options'] = {responsive: true, plugins: { legend: { display: true, }, }, };

  private getBorderColor(): string {
    if (this.stockEntry) {
      return this.stockEntry.returns !== null && this.stockEntry.returns < 0 ? 'red' : 'green';
    } else {
      return 'rgba(75,192,192,1)'; // Default color
    }
  }
    

  constructor(private router: Router, private stockService: StockService) { }

  ngOnInit() {
    const verticalHoverLinePlugin = {
      id: 'verticalHoverLine',
      afterDraw(chart: any) {
        if (chart.tooltip?._active?.length) {
          const ctx = chart.ctx;
          const active = chart.tooltip._active[0];
          const x = active.element.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;
    
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(21, 17, 17, 0.5)';
          ctx.stroke();
          ctx.restore();
        }
      }
    };
    
    Chart.register(verticalHoverLinePlugin);
    this.loadData();
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
  //     this.loadingChart = true; // Set loading state to true before chart loads
  //     this.chartData.labels = this.stockEntry.date;
  //     this.chartData.datasets[0].data = this.stockEntry.adj_close;
  //     // Add Upper Bollinger Band data if available
  //     if (this.stockEntry.upper_bollinger && this.stockEntry.upper_bollinger.length > 0) {
  //       this.chartData.datasets[1].data = this.stockEntry.upper_bollinger;
  //       this.chartData.datasets[1].hidden = false;
  //     } else {
  //       this.chartData.datasets[1].data = [];  // Set empty if not available
  //       this.chartData.datasets[1].hidden = true; // Hide the dataset if no data
  //     }

  //     // Add Lower Bollinger Band data if available
  //     if (this.stockEntry.lower_bollinger && this.stockEntry.lower_bollinger.length > 0) {
  //       this.chartData.datasets[2].data = this.stockEntry.lower_bollinger;
  //       this.chartData.datasets[2].hidden = false;
  //     } else {
  //       this.chartData.datasets[2].data = [];  // Set empty if not available
  //       this.chartData.datasets[2].hidden = true; // Hide the dataset if no data
  //     }
  //     this.chartData.datasets[0].borderColor = this.getBorderColor();
  //     this.chart?.update();
  //     this.loadingChart = false; 
  //   }
  // }

  loadData() {
    
    if (this.stockEntry) {
      console.log(this.stockEntry.date)
      this.loadingChart = true;
      let macd_pres = false;
      let rsi_pres = false;
  
      const datasets: ChartDataset<'line'>[] = [
        {
          data: this.stockEntry.adj_close,
          label: 'Adjusted Close Price',
          fill: false,
          borderColor: this.getBorderColor(),
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHitRadius: 10,
        }
      ];
  
      const upper = this.stockEntry.upper_bollinger;
      if (upper && upper.length > 0) {
        datasets.push({
          data: upper,
          label: 'Upper Bollinger Band',
          fill: false,
          borderColor: 'rgba(255,99,132,1)',  // Choose color for upper Bollinger Band
          borderWidth: 0.8,
          tension: 0.1,
          pointRadius: 0,          // hide points
          pointHoverRadius: 5,     // show on hover
          pointHitRadius: 10,  
        });
      }
  
      const lower = this.stockEntry.lower_bollinger;
      if (lower && lower.length > 0) {
        datasets.push({
          data: lower,
          label: 'Lower Bollinger Band',
          fill: false,
          borderColor: 'rgba(54,162,235,1)',  // Choose color for lower Bollinger Band
          borderWidth: 1,
          tension: 0.1,
          pointRadius: 0,          // hide points
          pointHoverRadius: 6,     // show on hover
          pointHitRadius: 10,  
        });
      }
    
      this.mainChartData.labels = this.stockEntry.date;
      this.mainChartData.datasets = datasets;
      // this.mainChartOptions = this.createChartOptions(true, 2);

      const rsi = this.stockEntry.rsi;
      if (rsi && rsi.length > 0) {
        rsi_pres = true;
        const rsi_dataset = [{
          data: rsi,
          label: 'RSI',
          fill: false,
          borderColor: 'rgb(241, 186, 5)',  // Choose color for lower Bollinger Band
          borderWidth: 1,
          tension: 0.1,
          pointRadius: 0,          // hide points
          pointHoverRadius: 6,     // show on hover
          pointHitRadius: 10,  
        }];
        this.rsiChartData.labels = this.stockEntry.date;
        this.rsiChartData.datasets = rsi_dataset;
        // this.mainChartOptions = this.createChartOptions(false, 3); // No X-axis labels for main chart
        // this.rsiChartOptions = this.createChartOptions(true, 6);  // No X-axis labels for RSI
        // this.macdChartOptions = this.createChartOptions(true); 
      }

      const macd = this.stockEntry.macd;
      const macd_signal = this.stockEntry.macd_signal;


      if (macd && macd.length > 0 && macd_signal && macd_signal.length > 0) {
        macd_pres = true;
        const macd_dataset: ChartDataset<'line'>[] = [
          {
            data: macd,
            label: 'MACD',
            fill: false,
            borderColor: 'rgb(44, 241, 5)',  // Choose color for lower Bollinger Band
            borderWidth: 1,
            tension: 0.1,
            pointRadius: 0,          // hide points
            pointHoverRadius: 6,     // show on hover
            pointHitRadius: 10,  
          },
          {
            data: macd_signal,
            label: 'MACD Signal',
            fill: false,
            borderColor: 'rgb(232, 80, 30)',  // Choose color for lower Bollinger Band
            borderWidth: 1,
            tension: 0.1,
            pointRadius: 0,          // hide points
            pointHoverRadius: 6,     // show on hover
            pointHitRadius: 10,  
          }
        ];

        this.macdChartData.labels = this.stockEntry.date;
        this.macdChartData.datasets = macd_dataset;
        // No X-axis labels for RSI

        // this.mainChartOptions = this.createChartOptions(false, 3); // No X-axis labels for main chart
        // this.rsiChartOptions = this.createChartOptions(false, 6);  // No X-axis labels for RSI
        // this.macdChartOptions = this.createChartOptions(true, 6); // X-axis labels for MACD

    }

    if (!macd_pres && !rsi_pres) {
      this.mainChartOptions = this.createChartOptions(true, 2);
    } else if (macd_pres && !rsi_pres) {
      this.mainChartOptions = this.createChartOptions(false, 3); // No X-axis labels for main chart
      this.macdChartOptions = this.createChartOptions(true, 4.5);  
    } else if (!macd_pres && rsi_pres) {
      this.mainChartOptions = this.createChartOptions(false, 3); // No X-axis labels for main chart
      this.rsiChartOptions = this.createChartOptions(true, 4.5);
    } else if (rsi_pres && macd_pres) {
      this.mainChartOptions = this.createChartOptions(false, 3); // No X-axis labels for main chart
      this.rsiChartOptions = this.createChartOptions(false, 6);  // No X-axis labels for RSI
      this.macdChartOptions = this.createChartOptions(true, 4.5); // X-axis labels for MACD
    }
  
  

  
      this.chart?.update();
      this.loadingChart = false;
    }
  }
  

  
  createChartOptions(showXAxis: boolean, asp_ratio: number, min?: string, max?: string): ChartConfiguration<'line'>['options'] {
    const verticalLinePlugin = {
      id: 'hoverLine',
      afterDraw: (chart: any) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const ctx = chart.ctx;
          const activePoint = chart.tooltip._active[0];
          const x = activePoint.element.x;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.stroke();
          ctx.restore();
        }
      }
    };

    return {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: asp_ratio,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            // displayFormats: {
            //   day: 'MMM D',
            //   month: 'MMM YYYY',
            //   year: 'YYYY'
            // },
          },
          ticks: {
            display: showXAxis,
            maxTicksLimit: 20,
          },
          // grid: {
          //   display: showXAxis
          // },
          // min,
          // max
        },
        y: {
          ticks: { display: true },
          grid: { display: true }
        }
      }
    };
  }

  

}


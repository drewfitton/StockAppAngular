import { Component, ElementRef, HostListener } from '@angular/core';
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
  timePeriods: string[] = ["1W", "1M", "6M", "YTD", "1Y", "5Y"];
  selectedPeriod: string = "YTD"; // Default selected, like "1 Month"
  categoryOptions = [
    'All', 'Tech', 'Finance', 'Healthcare',
    'Startups', 'Retail', 'Sports', 'Energy', 'Entertainment'
  ];
  selectedCategory: string = 'All'; // Default selected category
  dropdownOpen = false;
  pageSize = 20;
  currentPage = 0;
  totalStocks = 0;
  paginatedStocks: StockEntry[] = [];
  loading = false;
  chartLoading = false; 


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
  constructor(private fb: FormBuilder, private stockService: StockService, private route: ActivatedRoute, private router: Router, private eRef: ElementRef) {}
  
  ngOnInit(): void {
    this.loadPaginatedStocks();
  }

  loadPaginatedStocks(): void {
    this.loading = true;
    const offset = this.currentPage * this.pageSize;

    this.stockService.getPaginatedStocks(this.selectedCategory, this.selectedDate, offset, this.pageSize)
      .subscribe({
        next: (response) => {
          this.paginatedStocks = response.results.sort((a, b) => b.returns - a.returns);
          this.totalStocks = response.total;
          this.loading = false;
          this.chartLoading = false; // After data is loaded, set chart loading to false
        },
        error: (err) => {
          console.error('Failed to load stocks', err);
          this.loading = false;
          this.chartLoading = false;
        }
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  onSelectCategory(option: string) {
    this.selectedCategory = option;
    this.currentPage = 0;
    this.loadPaginatedStocks();
  }
  
  onSelectPeriod(period: string) {
    this.selectedPeriod = period;
    this.selectedDate = calculateStartDate(period).toISOString().split('T')[0];
    this.currentPage = 0;
    this.loadPaginatedStocks();
  }
  
  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalStocks) {
      this.currentPage++;
      this.loadPaginatedStocks();
    }
  }
  
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPaginatedStocks();
    }
  }

  lastPage() {
    this.currentPage = Math.floor(this.totalStocks / this.pageSize);
    this.loadPaginatedStocks();
  }

  firstPage() {
    this.currentPage = 0;
    this.loadPaginatedStocks();
  }
  

}

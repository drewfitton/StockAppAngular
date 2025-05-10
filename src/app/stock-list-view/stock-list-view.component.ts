import { Component, ElementRef, HostListener } from '@angular/core';
import { StockEntry } from '../models/stock-entry.model';
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../services/stock.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from '../search-input/search-input.component';
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
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, StockCardComponent, SearchInputComponent],
  templateUrl: './stock-list-view.component.html',
  styleUrl: './stock-list-view.component.css'
})
export class StockListViewComponent { // implements OnInit {
  stock_data: StockEntry[] = [];
  filtered_data: StockEntry[] = [];
  stock_names: { [key: string]: string } = {};
  selectedDate: string  = '2025-01-01';
  timePeriods: string[] = ["1W", "1M", "6M", "YTD", "1Y", "5Y"];
  selectedPeriod: string = "YTD"; // Default selected, like "1 Month"
  categoryOptions = [
    'All', 'Tech', 'Finance', 'Healthcare',
    'Startups', 'Retail', 'Sports', 'Energy', 'Entertainment'
  ];
  selectedCategory: string = 'All'; // Default selected category
  indicators: string[] = ['Bollinger', 'MACD', 'RSI'];
  selectedIndicators: string[] = [];
  dropdownOpen = false;
  pageSize = 20;
  currentPage = 0;
  totalStocks = 0;
  paginatedStocks: StockEntry[] = [];
  searchStocks: StockEntry[] = [];
  loading = true;
  chartLoading = false;
  searchDropdownOpen = false;


  constructor(private fb: FormBuilder, private stockService: StockService, private route: ActivatedRoute, private router: Router, private eRef: ElementRef) {}
  
  ngOnInit(): void {
    this.loadPaginatedStocks();
  }

  loadPaginatedStocks(): void {
    this.loading = true;
    const offset = this.currentPage * this.pageSize;

    this.stockService.getPaginatedStocks(this.selectedCategory, this.selectedDate, this.selectedIndicators, offset, this.pageSize)
      .subscribe({
        next: (response) => {
          this.paginatedStocks = response.results.sort((a, b) => b.returns - a.returns);
          this.totalStocks = response.total;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load stocks', err);
          this.loading = false;
        }
      });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;
  @ViewChild('searchRef') searchRef!: ElementRef;
  @ViewChild('searchInput') searchInput!: SearchInputComponent; // <-- Add this


  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }

    if (this.searchDropdownOpen && !this.searchRef.nativeElement.contains(event.target)) {
      this.searchDropdownOpen = false;
      this.searchStocks = [];
      this.searchInput.reset();
    }
  }


  onSelectCategory(option: string) {
    this.selectedCategory = option;
    this.currentPage = 0;
    this.dropdownOpen = false;
    this.loadPaginatedStocks();
  }
  
  onSelectPeriod(period: string) {
    this.selectedPeriod = period;
    this.selectedDate = calculateStartDate(period).toISOString().split('T')[0];
    this.currentPage = 0;
    this.loadPaginatedStocks();
  }

  onSelectIndicator(indicator: string) {
    const index = this.selectedIndicators.indexOf(indicator);
    if (index === -1) {
      this.selectedIndicators.push(indicator);
    } else {
      this.selectedIndicators.splice(index, 1);
    }
    console.log('Selected Indicators:', this.selectedIndicators);
    this.loadPaginatedStocks();
  }
  

  onTextChange(searchText: string) {
    console.log('Search text changed:', searchText);
    console.log('Stock data:', this.filtered_data);
    if (searchText.length === 0) {
      this.searchStocks = [];
      this.searchDropdownOpen = false;
    } else {
      this.searchStocks = this.paginatedStocks.filter(stock =>
        stock.ticker.toLowerCase().includes(searchText.toLowerCase()) ||
        stock.company.toLowerCase().includes(searchText.toLowerCase())
      );
      this.searchDropdownOpen = true;
    }
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

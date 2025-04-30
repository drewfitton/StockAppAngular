import { StockEntry } from "./models/stock-entry.model";

export interface PaginatedStockResponse {
    total: number; // total number of matching stocks
    results: StockEntry[]; // page of stock entries
}

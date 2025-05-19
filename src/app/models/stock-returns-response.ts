import { StockReturns } from "./stock-returns.model";

export interface StockReturnsResponse {
    total: number; // total number of matching stocks
    results: StockReturns[]; // page of stock entries
}

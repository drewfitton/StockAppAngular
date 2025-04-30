export interface StockEntry {
    id: number;
    ticker: string;
    company: string;
    returns: number;
    img: string;
    date: string[];
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    adj_close: number[];
    volume: number[];
}

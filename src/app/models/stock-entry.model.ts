export interface StockEntry {
    id: number;
    ticker: string;
    company: string;
    img: string;
    returns: number;
    ml_ind: number;
    date: Date[];
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    adj_close: number[];
    lower_bollinger: number[] | undefined;
    upper_bollinger: number[] | undefined;
    rsi: number[] | undefined;
    macd: number[] | undefined;
    macd_signal: number[] | undefined;
    volume: number[];
}

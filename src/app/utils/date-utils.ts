export function subtractDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() - days);
    return copy;
  }
  
  export function subtractBusinessDays(date: Date, businessDays: number): Date {
    const copy = new Date(date);
    let daysSubtracted = 0;
    while (daysSubtracted < businessDays) {
      copy.setDate(copy.getDate() - 1);
      if (copy.getDay() !== 0 && copy.getDay() !== 6) { // skip weekends
        daysSubtracted++;
      }
    }
    return copy;
  }
  
  export function subtractMonths(date: Date, months: number): Date {
    const copy = new Date(date);
    copy.setMonth(copy.getMonth() - months);
    return copy;
  }
  
  export function subtractYears(date: Date, years: number): Date {
    const copy = new Date(date);
    copy.setFullYear(copy.getFullYear() - years);
    return copy;
  }
  
  export function calculateStartDate(period: string): Date {
    const now = new Date();
  
    switch (period) {
      case "5D":
        return subtractBusinessDays(now, 5);
      case "1W":
        return subtractDays(now, 7);
      case "1M":
        return subtractMonths(now, 1);
      case "6M":
        return subtractMonths(now, 6);
      case "YTD":
        return new Date(now.getFullYear(), 0, 1);
      case "1Y":
        return subtractYears(now, 1);
      case "5Y":
        return subtractYears(now, 5);
      default:
        return now;
    }
  }
  
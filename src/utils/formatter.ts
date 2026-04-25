export interface FormatSettings {
  dateFormat: string; // DD.MM.YYYY, MM/DD/YYYY, etc.
  timeFormat: '24h' | '12h';
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.' | ' ' | '';
  negativeFormat: '-' | '()'; // -1500.75 or (1500.75)
  currencyFormat: {
    position: 'before' | 'after';
    useSymbol: boolean; // Symbol (₼) or ISO (AZN)
    addSpace: boolean;
  };
}

export const defaultSettings: FormatSettings = {
  dateFormat: 'DD.MM.YYYY',
  timeFormat: '24h',
  decimalSeparator: '.',
  thousandsSeparator: ' ',
  negativeFormat: '-',
  currencyFormat: {
    position: 'after',
    useSymbol: true,
    addSpace: true
  }
};

export class Formatter {
  settings: FormatSettings;

  constructor(settings: FormatSettings = defaultSettings) {
    this.settings = settings;
  }

  formatDate(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
    if (!date) return '---';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '---';

    // If custom Intl options are provided, use them (e.g., { month: 'short', year: '2-digit' })
    if (options) {
      return new Intl.DateTimeFormat('az-AZ', options).format(d);
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());

    switch (this.settings.dateFormat) {
      case 'DD.MM.YYYY': return `${day}.${month}.${year}`;
      case 'MM.DD.YYYY': return `${month}.${day}.${year}`;
      case 'YYYY.MM.DD': return `${year}.${month}.${day}`;
      case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
      default: return `${day}.${month}.${year}`;
    }
  }

  formatTime(date: Date | string | null | undefined): string {
    if (!date) return '---';
    
    let hours: number;
    let minutes: string;

    if (typeof date === 'string' && date.includes(':') && !date.includes('-') && !date.includes('T')) {
      // Handle "HH:mm" or "HH:mm:ss" strings
      const parts = date.split(':');
      hours = parseInt(parts[0], 10);
      minutes = parts[1].padStart(2, '0');
    } else {
      const d = new Date(date);
      if (isNaN(d.getTime())) return '---';
      hours = d.getHours();
      minutes = String(d.getMinutes()).padStart(2, '0');
    }

    if (this.settings.timeFormat === '12h') {
      const ampm = hours >= 12 ? 'PM' : 'AM';
      let displayHours = hours % 12;
      displayHours = displayHours ? displayHours : 12; // 0 should be 12
      return `${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  formatNumber(value: number | null | undefined, options: { 
    decimals?: number, 
    type?: 'currency' | 'decimal' | 'percent' 
  } = {}): string {
    if (value === null || value === undefined) return '0';
    
    let isNegative = value < 0;
    let absValue = Math.abs(value);
    
    // Default decimals based on type
    const decimals = options.decimals !== undefined 
      ? options.decimals 
      : (options.type === 'currency' ? 2 : (options.type === 'percent' ? 2 : 2));

    let formatted = absValue.toFixed(decimals);
    let [integerPart, decimalPart] = formatted.split('.');

    // Add thousands separator
    if (this.settings.thousandsSeparator) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, this.settings.thousandsSeparator);
    }

    // Combine with decimal separator
    let result = decimalPart 
      ? `${integerPart}${this.settings.decimalSeparator}${decimalPart}`
      : integerPart;

    // Handle negative
    if (isNegative) {
      if (this.settings.negativeFormat === '()') {
        result = `(${result})`;
      } else {
        result = `-${result}`;
      }
    }

    return result;
  }

  formatCurrency(value: number | null | undefined, currencyCode: string = 'AZN'): string {
    const formattedNumber = this.formatNumber(value, { type: 'currency' });
    const { position, useSymbol, addSpace } = this.settings.currencyFormat;
    
    const symbols: Record<string, string> = {
      'AZN': '₼',
      'USD': '$',
      'EUR': '€',
      'RUB': '₽',
      'GBP': '£'
    };

    const displaySymbol = useSymbol ? (symbols[currencyCode] || currencyCode) : currencyCode;
    const space = addSpace ? ' ' : '';

    if (position === 'before') {
      return `${displaySymbol}${space}${formattedNumber}`;
    } else {
      return `${formattedNumber}${space}${displaySymbol}`;
    }
  }
}

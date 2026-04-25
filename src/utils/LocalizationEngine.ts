export type Language = 'az' | 'en' | 'ru' | 'tr';

export interface TranslationRecord {
  entity: string;
  entityId: string;
  field: string;
  language: Language;
  value: string;
}

export interface LocalizationConfig {
  autoTranslate: boolean;
  fieldLevelFlags: Record<string, boolean>; // e.g., "product.name": true
}

class LocalizationEngine {
  private translations: TranslationRecord[] = [];
  private config: LocalizationConfig = {
    autoTranslate: true,
    fieldLevelFlags: {
      'product.name': true,
      'category.name': true,
      'service.name': true,
      'dashboard.title': true,
      'note.content': true,
      'invoice.no': false,
      'contract.no': false,
      'tax.voen': false,
      'amount.value': false,
    }
  };

  constructor() {
    const saved = localStorage.getItem('erp_dynamic_translations');
    if (saved) this.translations = JSON.parse(saved);
  }

  private save() {
    localStorage.setItem('erp_dynamic_translations', JSON.stringify(this.translations));
  }

  /**
   * Translates dynamic data based on classification rules
   */
  public translateData(entity: string, entityId: string, field: string, originalValue: any, targetLang: Language): { value: any, isTranslated: boolean, original: any } {
    const fieldKey = `${entity}.${field}`;
    
    // Rule 1: Non-Translatable Data (CRITICAL)
    if (this.config.fieldLevelFlags[fieldKey] === false) {
      return { value: originalValue, isTranslated: false, original: originalValue };
    }

    // Rule 2: Check for existing manual translation
    const found = this.translations.find(t => 
      t.entity === entity && 
      t.entityId === entityId && 
      t.field === field && 
      t.language === targetLang
    );

    if (found) {
      return { value: found.value, isTranslated: true, original: originalValue };
    }

    // Rule 3: Auto-translation (Simulated AI)
    if (this.config.autoTranslate && this.config.fieldLevelFlags[fieldKey] === true) {
      // In a real app, this would call an API. Here we simulate a prefix.
      if (targetLang === 'az') return { value: originalValue, isTranslated: false, original: originalValue };
      const autoValue = `[${targetLang.toUpperCase()}] ${originalValue}`;
      return { value: autoValue, isTranslated: true, original: originalValue };
    }

    // Default: Return original
    return { value: originalValue, isTranslated: false, original: originalValue };
  }

  public addManualTranslation(record: TranslationRecord) {
    const index = this.translations.findIndex(t => 
      t.entity === record.entity && 
      t.entityId === record.entityId && 
      t.field === record.field && 
      t.language === record.language
    );

    if (index > -1) {
      this.translations[index] = record;
    } else {
      this.translations.push(record);
    }
    this.save();
  }

  public setAutoTranslate(enabled: boolean) {
    this.config.autoTranslate = enabled;
  }
}

export const localizationEngine = new LocalizationEngine();

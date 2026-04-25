// TENGRY SUPPLY - Enterprise Data Structure
// This file centralizes the nomenclature, inventory, and production logic for the system.

export type ItemType = 'FINISHED_GOOD' | 'RAW_MATERIAL' | 'SEMI_FINISHED' | 'AUXILIARY' | 'SERVICE' | 'WORK' | 'FIXED_ASSET' | 'LVA';

export interface NomenclatureItem {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  subCategoryId?: string;
  type: ItemType;
  unit: string;
  defaultPrice: number;
  costPrice?: number;
  bomId?: string;
  costingMethod?: string;
  currency?: string;
  accounts?: { inventory: string; expense: string; revenue: string; vat: string };
}

export interface BOMComponent {
  itemId: string;
  quantity: number;
  unit: string;
}

export interface BOM {
  id: string;
  targetItemId: string; // Finished Good or Semi-Finished
  components: BOMComponent[];
  productionTimeDays: number;
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: 'RECEIVING' | 'STORAGE' | 'PRODUCTION' | 'SHIPPING' | 'QUALITY_CONTROL';
}

export interface Warehouse {
  id: string;
  name: string;
  zones: WarehouseZone[];
}

// 1. CATEGORIES & SUB-CATEGORIES
export const TENGRY_CATEGORIES = [
  { 
    id: 'cat_inv', name: 'Ehtiyatlar', type: 'MATERIAL',
    subCategories: [
      { id: 'sub_inv_rm', name: 'Xammal' },
      { id: 'sub_inv_sf', name: 'Yarımfabrikatlar' },
      { id: 'sub_inv_fg', name: 'Hazır Məhsullar' },
      { id: 'sub_inv_aux', name: 'Köməkçi Materiallar' },
      { id: 'sub_inv_lva', name: 'ATƏ (LVA)' }
    ]
  },
  { id: 'cat_srv', name: 'Xidmətlər', type: 'SERVICE', subCategories: [] },
  { id: 'cat_wrk', name: 'İşlər', type: 'WORK', subCategories: [] },
  { 
    id: 'cat_fa', name: 'Torpaq, Tikili və Avadanlıqlar', type: 'FIXED_ASSET', 
    subCategories: [
      { id: 'sub_fa_build', name: 'Binalar, tikintilər və qurğular' },
      { id: 'sub_fa_mach', name: 'Maşınlar və avadanlıq' },
      { id: 'sub_fa_tech', name: 'Yüksək texnologiyalar məhsulu olan hesablama texnikası' },
      { id: 'sub_fa_veh', name: 'Nəqliyyat vasitələri' },
      { id: 'sub_fa_other', name: 'Digər əsas vəsaitlər' }
    ]
  },
  { id: 'cat_ia', name: 'Qeyri-maddi aktivlər', type: 'INTANGIBLE', subCategories: [] },
  { id: 'cat_ba', name: 'Bioloji aktivlər', type: 'BIOLOGICAL', subCategories: [] },
  { id: 'cat_nr', name: 'Təbii sərvətlər', type: 'NATURAL', subCategories: [] },
];

// 2. WAREHOUSES
export const TENGRY_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh_main',
    name: 'Mərkəzi Xammal Anbarı',
    zones: [
      { id: 'z_rm_rec', name: 'Xammal Qəbul Zonası', type: 'RECEIVING' },
      { id: 'z_rm_str', name: 'Xammal Saxlama Zonası', type: 'STORAGE' },
    ]
  },
  {
    id: 'wh_prod',
    name: 'İstehsalat Sahəsi (Factory)',
    zones: [
      { id: 'z_prod_line', name: 'Əsas İstehsalat Xətti', type: 'PRODUCTION' },
      { id: 'z_prod_sf', name: 'Yarımfabrikat Zonası', type: 'STORAGE' },
    ]
  },
  {
    id: 'wh_fg',
    name: 'Hazır Məhsul Anbarı',
    zones: [
      { id: 'z_fg_qc', name: 'Keyfiyyət Nəzarət', type: 'QUALITY_CONTROL' },
      { id: 'z_fg_str', name: 'FG Saxlama Zonası', type: 'STORAGE' },
      { id: 'z_fg_shp', name: 'Çıxış/Yükləmə Zonası', type: 'SHIPPING' },
    ]
  },
  {
    id: 'wh_proj',
    name: 'Layihə Anbarı (Construction Site)',
    zones: [
      { id: 'z_proj_inst', name: 'Quraşdırma Zonası', type: 'STORAGE' },
    ]
  }
];

// 3. NOMENCLATURE (The massive list - 50+ items)
export const TENGRY_NOMENCLATURE: NomenclatureItem[] = [
  // --- FINISHED GOODS (FG) - Ofis və mebel ---
  { 
    id: 'fg_01', sku: 'FG-OFF-001', name: 'Ofis kreslosu (Erqonomik)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 250, 
    costingMethod: 'AVCO', currency: 'AZN', 
    accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' }
  },
  { 
    id: 'fg_02', sku: 'FG-OFF-002', name: 'Metal ofis masası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 450, 
    costingMethod: 'AVCO', currency: 'AZN', 
    accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' }
  },
  { 
    id: 'fg_03', sku: 'FG-OFF-003', name: 'Taxta iş masası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 380, 
    costingMethod: 'AVCO', currency: 'AZN', 
    accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' }
  },
  { 
    id: 'fg_04', sku: 'FG-OFF-004', name: 'Arxiv dolabı (metal)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 320, 
    costingMethod: 'AVCO', currency: 'AZN', 
    accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' }
  },
  { id: 'fg_05', sku: 'FG-OFF-005', name: 'Kitab rəfi', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 150, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },
  { id: 'fg_06', sku: 'FG-OFF-006', name: 'Kompüter masası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 220, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },
  { id: 'fg_07', sku: 'FG-OFF-007', name: 'Konfrans masası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 1200, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },
  { id: 'fg_08', sku: 'FG-OFF-008', name: 'Plastik kreslo', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 45, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },
  { id: 'fg_09', sku: 'FG-OFF-009', name: 'Metal oturacaq', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 85, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },
  { id: 'fg_10', sku: 'FG-OFF-010', name: 'İşçi locker dolabı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 190, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.01', expense: '711.01', revenue: '601.01', vat: '521.01' } },

  // --- FINISHED GOODS - Sənaye məhsulları ---
  { id: 'fg_11', sku: 'FG-IND-011', name: 'Metal rəf sistemi', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'set', defaultPrice: 850, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_12', sku: 'FG-IND-012', name: 'Anbar palet rəfi', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'set', defaultPrice: 1500, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_13', sku: 'FG-IND-013', name: 'Sənaye stol', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 650, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_14', sku: 'FG-IND-014', name: 'Alət arabası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 280, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_15', sku: 'FG-IND-015', name: 'Metal platforma', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 3500, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_16', sku: 'FG-IND-016', name: 'Konstruksiya paneli', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'm2', defaultPrice: 45, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_17', sku: 'FG-IND-017', name: 'Havalandırma kanalı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'metr', defaultPrice: 35, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },
  { id: 'fg_18', sku: 'FG-IND-018', name: 'Elektrik panel qutusu', categoryId: 'cat_inv', subCategoryId: 'sub_inv_fg', type: 'FINISHED_GOOD', unit: 'ədəd', defaultPrice: 120, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '205.02', expense: '711.02', revenue: '601.02', vat: '521.01' } },

  // --- RAW MATERIALS (RM) ---
  { id: 'rm_01', sku: 'RM-MTL-001', name: 'Polad list', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 2.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_02', sku: 'RM-MTL-002', name: 'Alüminium profil', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'metr', defaultPrice: 12, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_03', sku: 'RM-MTL-003', name: 'Dəmir boru', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'metr', defaultPrice: 8, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_04', sku: 'RM-WOD-001', name: 'MDF panel', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'm2', defaultPrice: 18, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.02', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_05', sku: 'RM-WOD-002', name: 'Faner', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'm2', defaultPrice: 14, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.02', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_06', sku: 'RM-WOD-003', name: 'Laminat lövhə', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'm2', defaultPrice: 22, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.02', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'rm_07', sku: 'RM-MCH-007', name: 'Qaz lift mexanizmi', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'ədəd', defaultPrice: 45, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_08', sku: 'RM-PLS-008', name: 'Plastik oturacaq materialı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 5.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_09', sku: 'RM-FOM-009', name: 'Süngər (foam)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 8.2, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_10', sku: 'RM-FAB-010', name: 'Parça (üzlük)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'm2', defaultPrice: 15, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_11', sku: 'RM-CON-011', name: 'Sement', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 0.15, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_12', sku: 'RM-CON-012', name: 'Qum', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 0.05, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_13', sku: 'RM-CON-013', name: 'Çınqıl', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'kq', defaultPrice: 0.08, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_14', sku: 'RM-ELE-014', name: 'LED chip', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'ədəd', defaultPrice: 0.25, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_16', sku: 'RM-PLS-016', name: 'Plastik корпус', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'ədəd', defaultPrice: 3.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_17', sku: 'RM-ELE-017', name: 'Elektrik kabel', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'metr', defaultPrice: 1.2, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_18', sku: 'RM-INS-018', name: 'İzolyasiya materialı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'm2', defaultPrice: 4.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.05', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'rm_20', sku: 'RM-WAT-020', name: 'Su', categoryId: 'cat_inv', subCategoryId: 'sub_inv_rm', type: 'RAW_MATERIAL', unit: 'litr', defaultPrice: 0.01, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.01', expense: '202.01', revenue: '000', vat: '0' } },

  // --- SEMI-FINISHED (SF) ---
  { id: 'sf_01', sku: 'SF-MTL-001', name: 'Kəsilmiş metal hissə', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 15, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'sf_02', sku: 'SF-MTL-002', name: 'Qaynaq olunmuş karkas', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 85, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'sf_03', sku: 'SF-IND-001', name: 'Boyanmış panel', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'm2', defaultPrice: 25, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'sf_04', sku: 'SF-KRS-004', name: 'Metal karkas (Kreslo)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 65, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_05', sku: 'SF-REF-005', name: 'Rəf karkası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 120, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_06', sku: 'SF-REF-006', name: 'Rəf panelləri', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 35, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_07', sku: 'SF-ELE-007', name: 'Elektrik modul', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 45, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_08', sku: 'SF-PAN-008', name: 'Panel karkası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 95, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_09', sku: 'SF-DLB-009', name: 'Dolab karkası', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 110, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'sf_10', sku: 'SF-DLB-010', name: 'Qapı paneli', categoryId: 'cat_inv', subCategoryId: 'sub_inv_sf', type: 'SEMI_FINISHED', unit: 'ədəd', defaultPrice: 40, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '204.01', expense: '202.01', revenue: '000', vat: '241.01' } },

  // --- AUXILIARY MATERIALS ---
  { id: 'aux_01', sku: 'AUX-CHM-001', name: 'Boya (Boz)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'kq', defaultPrice: 12, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'aux_02', sku: 'AUX-FST-001', name: 'Bolt və qozlar', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'set', defaultPrice: 0.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '601.01', vat: '241.01' } },
  { id: 'aux_03', sku: 'AUX-GLU-003', name: 'Yapışdırıcı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'kq', defaultPrice: 15, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_04', sku: 'AUX-SCR-004', name: 'Vida', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'ədəd', defaultPrice: 0.1, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_05', sku: 'AUX-CHM-005', name: 'Boya (Qara)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'litr', defaultPrice: 18, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_07', sku: 'AUX-PLS-007', name: 'Plastik ayaq altlığı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'ədəd', defaultPrice: 0.8, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_08', sku: 'AUX-OIL-008', name: 'Kalıp yağı', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'litr', defaultPrice: 6.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_09', sku: 'AUX-SLD-009', name: 'Lehim (solder)', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'kq', defaultPrice: 45, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_10', sku: 'AUX-INS-010', name: 'İzolyasiya lent', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'metr', defaultPrice: 1.5, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },
  { id: 'aux_11', sku: 'AUX-HNG-011', name: 'Menteşe', categoryId: 'cat_inv', subCategoryId: 'sub_inv_aux', type: 'AUXILIARY', unit: 'ədəd', defaultPrice: 3.2, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.03', expense: '202.01', revenue: '000', vat: '241.01' } },

  // --- SERVICES & WORKS ---
  { id: 'srv_01', sku: 'SRV-LOG-001', name: 'Daşınma xidməti', categoryId: 'cat_srv', type: 'SERVICE', unit: 'reys', defaultPrice: 50, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '000', expense: '721.01', revenue: '601.01', vat: '521.01' } },
  { id: 'wrk_01', sku: 'WRK-CON-001', name: 'Metal konstruksiya quraşdırılması', categoryId: 'cat_wrk', type: 'WORK', unit: 'saat', defaultPrice: 35, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '000', expense: '202.01', revenue: '601.01', vat: '521.01' } },

  // --- FIXED ASSETS (FA) ---
  { id: 'fa_01', sku: 'FA-MCH-001', name: 'CNC dəzgahı', categoryId: 'cat_fa', subCategoryId: 'sub_fa_mach', type: 'FIXED_ASSET', unit: 'ədəd', defaultPrice: 85000, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '111.01', expense: '112.01', revenue: '000', vat: '521.01' } },
  
  // --- LVA (ATƏ) ---
  { id: 'lva_01', sku: 'LVA-TOL-001', name: 'Elektrik drill', categoryId: 'cat_inv', subCategoryId: 'sub_inv_lva', type: 'LVA', unit: 'ədəd', defaultPrice: 120, costingMethod: 'AVCO', currency: 'AZN', accounts: { inventory: '201.04', expense: '202.01', revenue: '000', vat: '521.01' } },
];

// 4. BILL OF MATERIALS (BOM)
export const TENGRY_BOMS: BOM[] = [
  {
    id: 'bom_fg_kreslo',
    targetItemId: 'fg_01', // Ofis kreslosu (Erqonomik)
    productionTimeDays: 1,
    components: [
      { itemId: 'sf_04', quantity: 1, unit: 'ədəd' }, // Metal karkas
      { itemId: 'rm_07', quantity: 1, unit: 'ədəd' }, // Qaz lift mexanizmi
      { itemId: 'rm_08', quantity: 2.5, unit: 'kq' }, // Plastik oturacaq materialı
      { itemId: 'rm_09', quantity: 1.2, unit: 'kq' }, // Süngər (foam)
      { itemId: 'rm_10', quantity: 1.5, unit: 'm2' }, // Parça (üzlük)
      { itemId: 'aux_04', quantity: 12, unit: 'ədəd' }, // Vida
      { itemId: 'aux_05', quantity: 0.3, unit: 'litr' }, // Boya (qara)
      { itemId: 'aux_03', quantity: 0.2, unit: 'kq' }, // Yapışdırıcı
    ]
  },
  {
    id: 'bom_fg_masa_metal',
    targetItemId: 'fg_02', // Metal ofis masası
    productionTimeDays: 2,
    components: [
      { itemId: 'sf_02', quantity: 1, unit: 'ədəd' }, // Qaynaq olunmuş karkas
      { itemId: 'rm_01', quantity: 18, unit: 'kq' }, // Polad list
      { itemId: 'rm_04', quantity: 1, unit: 'ədəd' }, // MDF masa üstü
      { itemId: 'aux_01', quantity: 0.5, unit: 'kq' }, // Boya (boz) - prompt says liter, we have kg
      { itemId: 'aux_02', quantity: 16, unit: 'set' }, // Bolt və qoz
      { itemId: 'aux_07', quantity: 4, unit: 'ədəd' }, // Plastik ayaq altlığı
    ]
  },
  {
    id: 'bom_fg_ref_sistemi',
    targetItemId: 'fg_11', // Metal rəf sistemi
    productionTimeDays: 1.5,
    components: [
      { itemId: 'sf_05', quantity: 1, unit: 'ədəd' }, // Rəf karkası
      { itemId: 'sf_06', quantity: 4, unit: 'ədəd' }, // Rəf panelləri
      { itemId: 'rm_02', quantity: 25, unit: 'kq' }, // Polad profil (using kq as requested)
      { itemId: 'rm_01', quantity: 12, unit: 'kq' }, // Polad list
      { itemId: 'aux_02', quantity: 24, unit: 'set' }, // Bolt və qoz
      { itemId: 'aux_01', quantity: 0.7, unit: 'kq' }, // Boya
    ]
  },
  {
    id: 'bom_fg_beton_blok',
    targetItemId: 'fg_20', // New item needed or map to something similar
    productionTimeDays: 0.5,
    components: [
      { itemId: 'rm_11', quantity: 8, unit: 'kq' }, // Sement
      { itemId: 'rm_12', quantity: 15, unit: 'kq' }, // Qum
      { itemId: 'rm_13', quantity: 10, unit: 'kq' }, // Çınqıl
      { itemId: 'rm_20', quantity: 5, unit: 'litr' }, // Su
      { itemId: 'aux_08', quantity: 0.1, unit: 'litr' }, // Kalıp yağı
    ]
  },
  {
    id: 'bom_fg_led_panel',
    targetItemId: 'fg_21',
    productionTimeDays: 1,
    components: [
      { itemId: 'sf_07', quantity: 1, unit: 'ədəd' }, // Elektrik modul
      { itemId: 'rm_16', quantity: 1, unit: 'ədəd' }, // Plastik корпус
      { itemId: 'rm_14', quantity: 20, unit: 'ədəd' }, // LED chip
      { itemId: 'rm_17', quantity: 2, unit: 'metr' }, // Elektrik kabel
      { itemId: 'aux_09', quantity: 0.05, unit: 'kq' }, // Lehim
      { itemId: 'aux_10', quantity: 0.5, unit: 'metr' }, // İzolyasiya lent
    ]
  },
  {
    id: 'bom_fg_metal_konst',
    targetItemId: 'fg_16', // Konstruksiya paneli
    productionTimeDays: 2,
    components: [
      { itemId: 'sf_08', quantity: 1, unit: 'ədəd' }, // Panel karkası
      { itemId: 'rm_03', quantity: 30, unit: 'kq' }, // Polad profil (using metr in RM, prompt says kq)
      { itemId: 'rm_18', quantity: 5, unit: 'm2' }, // İzolyasiya materialı
      { itemId: 'aux_01', quantity: 1, unit: 'kq' }, // Boya
      { itemId: 'aux_04', quantity: 30, unit: 'ədəd' }, // Vida
    ]
  },
  {
    id: 'bom_fg_taxta_dolab',
    targetItemId: 'fg_04', // Using Arxiv dolabı as base or add new
    productionTimeDays: 3,
    components: [
      { itemId: 'sf_09', quantity: 1, unit: 'ədəd' }, // Dolab karkası
      { itemId: 'sf_10', quantity: 2, unit: 'ədəd' }, // Qapı paneli
      { itemId: 'rm_04', quantity: 3, unit: 'm2' }, // MDF (lövhə -> m2)
      { itemId: 'rm_06', quantity: 4, unit: 'm2' }, // Laminat örtük
      { itemId: 'aux_11', quantity: 4, unit: 'ədəd' }, // Menteşe
      { itemId: 'aux_04', quantity: 20, unit: 'ədəd' }, // Vida
      { itemId: 'aux_03', quantity: 0.3, unit: 'kq' }, // Yapışdırıcı
    ]
  }
];

// 5. PROJECT STRUCTURE MOCK
export const TENGRY_PROJECT_TASKS = [
  { id: 'task_01', name: 'Hazırlıq və Mobilizasiya', type: 'WORK', nomenclatureId: 'wrk_01' },
  { id: 'task_02', name: 'Fundament Qazıntısı', type: 'WORK', nomenclatureId: 'wrk_03' },
  { id: 'task_03', name: 'Dəmir-Beton İşləri', type: 'WORK', nomenclatureId: 'wrk_03' },
  { id: 'task_04', name: 'Elektrik və İT İnfrastruktur', type: 'WORK', nomenclatureId: 'wrk_02' },
];

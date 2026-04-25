
import { TENGRY_BOMS, TENGRY_NOMENCLATURE } from '../tengryData';

export const runProcurementSimulation = () => {
  console.log('Starting Oct 2024 Procurement Simulation...');

  // 1. Define Vendors
  const vendors = [
    { id: 'V_MET_001', name: 'Metal Sənaye (Bakı) MMC', taxId: '1234567890', isVatPayer: true, isForeign: false },
    { id: 'V_TEX_002', name: 'Tekstil Dünyası Group', taxId: '9876543210', isVatPayer: false, isForeign: false },
    { id: 'V_AUX_003', name: 'Kimya və Boya Logistika', taxId: '5544332211', isVatPayer: true, isForeign: false },
  ];

  // 2. Define Requirements (for 30 units of each main BOM)
  // Simplified calculation for the simulation
  const scenarioInvoices = [
    {
      id: 'SIM_I_01',
      number: 'PINV-2024-10-01',
      vendor: 'Metal Sənaye (Bakı) MMC',
      date: '2024-10-01',
      total: 45600,
      status: 'COMPLETED',
      ref: 'CONT-2024-09-01',
      eInvNo: 'E-TAX-1001',
      eInvDate: '2024-10-01'
    },
    {
      id: 'SIM_I_02',
      number: 'PINV-2024-10-02',
      vendor: 'Tekstil Dünyası Group',
      date: '2024-10-02',
      total: 12450,
      status: 'COMPLETED',
      ref: 'CONT-2024-09-02',
      eInvNo: '', // Simple tax payer
      eInvDate: ''
    },
    {
      id: 'SIM_I_03',
      number: 'PINV-2024-10-03',
      vendor: 'Kimya və Boya Logistika',
      date: '2024-10-03',
      total: 8900,
      status: 'COMPLETED',
      ref: 'CONT-2024-09-03',
      eInvNo: 'E-TAX-1003',
      eInvDate: '2024-10-03'
    },
    {
      id: 'SIM_I_04',
      number: 'PINV-2024-10-04',
      vendor: 'Metal Sənaye (Bakı) MMC',
      date: '2024-10-04',
      total: 5600,
      status: 'COMPLETED',
      ref: 'CONT-2024-09-01',
      eInvNo: 'E-TAX-1004',
      eInvDate: '2024-10-04'
    },
    {
      id: 'SIM_I_05',
      number: 'PINV-2024-10-05',
      vendor: 'Kimya və Boya Logistika',
      date: '2024-10-05',
      total: 2300,
      status: 'COMPLETED',
      ref: 'CONT-2024-09-03',
      eInvNo: 'E-TAX-1005',
      eInvDate: '2024-10-05'
    }
  ];

  const scenarioReceipts = scenarioInvoices.map(inv => ({
    id: `SIM_R_${inv.id}`,
    number: `GRN-${inv.number.split('PINV-')[1]}`,
    vendor: inv.vendor,
    date: inv.date,
    warehouse: 'Əsas Anbar',
    status: 'COMPLETED',
    invoiceStatus: 'INVOICED'
  }));

  // 3. Save to localStorage
  // Merge with existing if any, avoiding duplicates by ID
  const existingInvoices = JSON.parse(localStorage.getItem('TENGRY_PURCHASE_INVOICES') || '[]');
  const existingReceipts = JSON.parse(localStorage.getItem('TENGRY_PURCHASE_RECEIPTS') || '[]');

  const mergedInvoices = [...existingInvoices];
  scenarioInvoices.forEach(inv => {
    if (!mergedInvoices.find(e => e.id === inv.id)) mergedInvoices.push(inv);
  });

  const mergedReceipts = [...existingReceipts];
  scenarioReceipts.forEach(rec => {
    if (!mergedReceipts.find(e => e.id === rec.id)) mergedReceipts.push(rec);
  });

  localStorage.setItem('TENGRY_PURCHASE_INVOICES', JSON.stringify(mergedInvoices));
  localStorage.setItem('TENGRY_PURCHASE_RECEIPTS', JSON.stringify(mergedReceipts));
  
  // Also save simulated contracts if needed
  const scenarioContracts = [
    { id: 'SIM_C_01', number: 'CONT-2024-09-01', vendor: 'Metal Sənaye (Bakı) MMC', date: '2024-09-15', type: 'PURCHASE', status: 'ACTIVE' },
    { id: 'SIM_C_02', number: 'CONT-2024-09-02', vendor: 'Tekstil Dünyası Group', date: '2024-09-16', type: 'PURCHASE', status: 'ACTIVE' },
    { id: 'SIM_C_03', number: 'CONT-2024-09-03', vendor: 'Kimya və Boya Logistika', date: '2024-09-17', type: 'PURCHASE', status: 'ACTIVE' },
  ];
  localStorage.setItem('TENGRY_CONTRACTS', JSON.stringify(scenarioContracts));

  console.log('Simulation complete. Oct 2024 documents generated.');
  return true;
};

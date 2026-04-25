/**
 * Azerbaijan Official Payroll & Employer Cost Calculator (2026 Standards)
 * Reference: Tax Code of AR (Article 101.3 & 101.2), Law on Social Insurance & Medical Insurance.
 */

export type Sector = 'PRIVATE' | 'STATE';
export type WorkplaceType = 'MAIN' | 'ADDITIONAL';

export interface CalculationDetails {
  gross: number;
  net: number;
  incomeTax: number;
  dsmfEmployee: number;
  itsEmployee: number;
  unemploymentEmployee: number;
  unionFee: number;
  totalEmployeeDeductions: number;
  // Employer side
  dsmfEmployer: number;
  itsEmployer: number;
  unemploymentEmployer: number;
  totalEmployerCost: number;
  superGross: number; // total cost
}

export interface CalculationParams {
  amount: number;
  sector: Sector;
  workplaceType: WorkplaceType;
  unionFeePercent: number;
  year: number; // Added to handle historical rules
  exemptionAmount?: number; // Article 102 exemptions (e.g. 400, 200, 100, 55)
  isExempted?: boolean; 
}

export const calculateOfficialPayroll = (params: CalculationParams, mode: 'GROSS_TO_NET' | 'NET_TO_GROSS' = 'GROSS_TO_NET'): CalculationDetails => {
  const { amount, sector, workplaceType, unionFeePercent, year, exemptionAmount = 0 } = params;
  
  const calculate = (gross: number): CalculationDetails => {
    let incomeTax = 0;
    let dsmfEmployee = 0;
    let itsEmployee = 0;
    let unemploymentEmployee = 0;
    let dsmfEmployer = 0;
    let itsEmployer = 0;
    let unemploymentEmployer = 0;

    // Relief (Güzəşt): 200 AZN only for Main Workplace (pre-2019 reference, but still relevant for State sector)
    const basicRelief = workplaceType === 'MAIN' ? 200 : 0;

    // 1. UNEMPLOYMENT (0.5% for both)
    unemploymentEmployee = gross * 0.005;
    unemploymentEmployer = gross * 0.005;

    // TAXABLE INCOME BASE
    const effectiveExemption = workplaceType === 'MAIN' ? exemptionAmount : 0;
    const taxableIncome = Math.max(0, gross - basicRelief - effectiveExemption);

    if (sector === 'PRIVATE') {
      /** PRIVATE SECTOR (NON-OIL) **/
      
      // INCOME TAX
      if (year >= 2026) {
        // New 2026 Rules (introduced in this project context)
        if (taxableIncome <= 2500) {
          incomeTax = taxableIncome * 0.03;
        } else if (taxableIncome <= 8000) {
          incomeTax = 75 + (taxableIncome - 2500) * 0.10;
        } else {
          incomeTax = 625 + (taxableIncome - 8000) * 0.14;
        }
      } else if (year >= 2019) {
        // 2019-2025: 0% Tax Incentive up to 8000 AZN
        if (gross <= 8000) {
          incomeTax = 0;
        } else {
          incomeTax = (gross - 8000) * 0.14;
        }
      } else {
        // Pre-2019 or other conditions (Simplified as per user's "vergi tətbiq olunmurdu" for ease)
        incomeTax = 0;
      }

      // DSMF EMPLOYEE (EXCEL Formula: IF(Gross<=200; Gross*3%; 6+(Gross-200)*10%))
      if (gross <= 200) {
        dsmfEmployee = gross * 0.03;
      } else {
        dsmfEmployee = 6 + (gross - 200) * 0.10;
      }

      // DSMF EMPLOYER (EXCEL Formula: IF(Gross<=200; Gross*22%; IF(Gross<=8000; 44+(Gross-200)*15%; 1214+(Gross-8000)*11%)))
      if (gross <= 200) {
        dsmfEmployer = gross * 0.22;
      } else if (gross <= 8000) {
        dsmfEmployer = 44 + (gross - 200) * 0.15;
      } else {
        dsmfEmployer = 1214 + (gross - 8000) * 0.11;
      }

      // ITS (MEDICAL) (EXCEL Formula: IF(Gross<=2500; Gross*2%; 50+(Gross-2500)*0.5%))
      if (gross <= 2500) {
        itsEmployee = gross * 0.02;
        itsEmployer = gross * 0.02;
      } else {
        itsEmployee = 50 + (gross - 2500) * 0.005;
        itsEmployer = 50 + (gross - 2500) * 0.005;
      }

    } else {
      /** STATE / OIL SECTOR RULES **/
      
      // INCOME TAX (14% up to 2500, 25% above 2500)
      if (gross <= 2500) {
        incomeTax = taxableIncome * 0.14;
      } else {
        const baseTaxAt2500 = (2500 - basicRelief) * 0.14;
        incomeTax = baseTaxAt2500 + (gross - 2500) * 0.25;
      }

      // DSMF (Flat 3% / 22%)
      dsmfEmployee = gross * 0.03;
      dsmfEmployer = gross * 0.22;

      // ITS (MEDICAL) (2% up to 8000, 0.5% on excess)
      if (gross <= 8000) {
        itsEmployee = gross * 0.02;
        itsEmployer = gross * 0.02;
      } else {
        itsEmployee = 160 + (gross - 8000) * 0.005;
        itsEmployer = 160 + (gross - 8000) * 0.005;
      }
    }

    const unionFee = gross * (unionFeePercent / 100);
    const totalEmployeeDeductions = incomeTax + dsmfEmployee + itsEmployee + unemploymentEmployee + unionFee;
    const net = gross - totalEmployeeDeductions;
    const totalEmployerOccupationalCosts = dsmfEmployer + itsEmployer + unemploymentEmployer;
    
    return {
      gross: Number(gross.toFixed(2)),
      net: Number(net.toFixed(2)),
      incomeTax: Number(incomeTax.toFixed(2)),
      dsmfEmployee: Number(dsmfEmployee.toFixed(2)),
      itsEmployee: Number(itsEmployee.toFixed(2)),
      unemploymentEmployee: Number(unemploymentEmployee.toFixed(2)),
      unionFee: Number(unionFee.toFixed(2)),
      totalEmployeeDeductions: Number(totalEmployeeDeductions.toFixed(2)),
      dsmfEmployer: Number(dsmfEmployer.toFixed(2)),
      itsEmployer: Number(itsEmployer.toFixed(2)),
      unemploymentEmployer: Number(unemploymentEmployer.toFixed(2)),
      totalEmployerCost: Number(totalEmployerOccupationalCosts.toFixed(2)),
      superGross: Number((gross + totalEmployerOccupationalCosts).toFixed(2))
    };
  };

  if (mode === 'GROSS_TO_NET') {
    return calculate(amount);
  } else {
    // Resolver for Net to Gross
    let low = amount;
    let high = amount * 3;
    let mid = 0;
    for (let i = 0; i < 25; i++) {
        mid = (low + high) / 2;
        const res = calculate(mid);
        if (res.net < amount) low = mid;
        else high = mid;
    }
    return calculate(mid);
  }
};

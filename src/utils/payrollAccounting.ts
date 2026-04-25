/**
 * Payroll Accounting Integration Logic
 * Maps payroll calculation results to Azerbaijan Chart of Accounts (2024)
 * - Local Employees: Expense 721.01.01, Liability 533.01
 * - Foreign Employees: Expense 721.01.02, Liability 533.02
 * - Income Tax: 521.09
 * - Social Deductions: 522.01, 522.02, 522.03
 */

export interface JournalEntry {
    no?: string;
    date: string;
    description: string;
    amount: number;
    docType: 'PAYROLL';
    details: JournalDetail[];
}

export interface JournalDetail {
    debitAccountCode?: string;
    creditAccountCode?: string;
    amount: number;
    description?: string;
}

export const generatePayrollJournal = (
    payrollData: any[], 
    month: number, 
    year: number,
    companyName: string
): JournalEntry => {
    const totalGrossLocal = payrollData
        .filter(p => !p.employee || !p.employee.citizenship || p.employee.citizenship === 'Azərbaycan')
        .reduce((sum, p) => sum + (Number(p.gross) || 0), 0);

    const totalGrossForeign = payrollData
        .filter(p => p.employee && p.employee.citizenship && p.employee.citizenship !== 'Azərbaycan')
        .reduce((sum, p) => sum + (Number(p.gross) || 0), 0);

    const totalIncomeTax = payrollData.reduce((sum, p) => sum + (Number(p.incomeTax) || 0), 0);
    const totalMDSS_ee = payrollData.reduce((sum, p) => sum + (Number(p.dsmfEmployee) || 0), 0);
    const totalUnempl_ee = payrollData.reduce((sum, p) => sum + (Number(p.unemploymentEmployee) || 0), 0);
    const totalITS_ee = payrollData.reduce((sum, p) => sum + (Number(p.itsEmployee) || 0), 0);

    const totalMDSS_er = payrollData.reduce((sum, p) => sum + (Number(p.dsmfEmployer) || 0), 0);
    const totalUnempl_er = payrollData.reduce((sum, p) => sum + (Number(p.unemploymentEmployer) || 0), 0);
    const totalITS_er = payrollData.reduce((sum, p) => sum + (Number(p.itsEmployer) || 0), 0);

    const details: JournalDetail[] = [];

    // 1. Gross Salary Recognition (Local)
    if (totalGrossLocal > 0) {
        details.push({
            debitAccountCode: '721.01.01',
            creditAccountCode: '533.01',
            amount: totalGrossLocal,
            description: 'Ümumi əmək haqqı xərci (Yerli işçilər)'
        });
    }

    // 2. Gross Salary Recognition (Foreign)
    if (totalGrossForeign > 0) {
        details.push({
            debitAccountCode: '721.01.02',
            creditAccountCode: '533.02',
            amount: totalGrossForeign,
            description: 'Ümumi əmək haqqı xərci (Xarici işçilər)'
        });
    }

    // 3. Deductions (Employee Side)
    // Debit 533.0x / Credit tax/social accounts
    // We handle them as bulk for simplicity in one transaction
    if (totalIncomeTax > 0) {
        details.push({
            debitAccountCode: '533.01', // Local liability reduction
            creditAccountCode: '521.09',
            amount: totalIncomeTax,
            description: 'İşçilərdən tutulan gəlir vergisi'
        });
    }

    if (totalMDSS_ee > 0) {
        details.push({
            debitAccountCode: '533.01',
            creditAccountCode: '522.01',
            amount: totalMDSS_ee,
            description: 'İşçilərdən tutulan MDSS (3%+10%)'
        });
    }

    if (totalUnempl_ee > 0) {
        details.push({
            debitAccountCode: '533.01',
            creditAccountCode: '522.02',
            amount: totalUnempl_ee,
            description: 'İşçilərdən tutulan İşsizlik sığortası (0.5%)'
        });
    }

    if (totalITS_ee > 0) {
        details.push({
            debitAccountCode: '533.01',
            creditAccountCode: '522.03',
            amount: totalITS_ee,
            description: 'İşçilərdən tutulan İTS (2%)'
        });
    }

    // 4. Employer Side Expenses (Social)
    const totalEmployerSocial = totalMDSS_er + totalUnempl_er + totalITS_er;
    if (totalEmployerSocial > 0) {
        details.push({
            debitAccountCode: '721.02',
            creditAccountCode: '522.01',
            amount: totalMDSS_er,
            description: 'İşəgötürənin MDSS xərci (15%+22%)'
        });
        details.push({
            debitAccountCode: '721.02',
            creditAccountCode: '522.02',
            amount: totalUnempl_er,
            description: 'İşəgötürənin İşsizlik sığortası xərci (0.5%)'
        });
        details.push({
            debitAccountCode: '721.02',
            creditAccountCode: '522.03',
            amount: totalITS_er,
            description: 'İşəgötürənin İTS xərci (2%)'
        });
    }

    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

    return {
        date: new Date(year, month, 0).toISOString().split('T')[0], // End of month
        description: `Əmək haqqı hesablanması — ${months[month-1]} ${year}`,
        amount: payrollData.reduce((sum, p) => sum + (Number(p.gross) || 0), 0) + totalEmployerSocial,
        docType: 'PAYROLL',
        details
    };
};

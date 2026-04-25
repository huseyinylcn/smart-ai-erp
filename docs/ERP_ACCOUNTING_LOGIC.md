# ERP Accounting & Finance Logic (TRD Compliance)

Bu sənəd SmartAgent ERP sisteminin mühasibat, maliyyə və vergi uçotu məntiqlərini Azərbaycan Respublikasının qanunvericiliyinə və Beynəlxalq Maliyyə Hesabatı Standartlarına (IFRS) uyğun olaraq müəyyən edir.

## 1. Multi-Ledger Arxitekturası
Sistem hər bir əməliyyatı 3 fərqli uçot növü üçün paralel emal edir:
- **Vergi Uçotu (Tax Ledger):** AR Vergi Məcəlləsi əsasında.
- **Maliyyə Uçotu (Financial Ledger):** IFRS/IAS əsasında.
- **İdarəetmə Uçotu (Management Ledger):** Şirkətin daxili ehtiyacları üçün.

## 2. Hesablar Planı (Chart of Accounts)
Azərbaycan Respublikasında tətbiq edilən 3-rəqəmli sintetik hesablar planı əsas götürülür:
- **1-ci sinif:** Uzunmüddətli aktivlər (111, 113 və s.)
- **2-ci sinif:** Qısamüddətli aktivlər (201, 211, 221, 241 və s.)
- **3-cü sinif:** Kapital (301, 311, 331, 341 və s.)
- **4-cü sinif:** Uzunmüddətli öhdəliklər (401, 441 və s.)
- **5-ci sinif:** Qısamüddətli öhdəliklər (531, 533, 542 və s.)
- **6-cı sinif:** Gəlirlər (601, 611, 631 və s.)
- **7-ci sinif:** Xərclər (701, 711, 721, 731 və s.)
- **8-ci sinif:** Mənfəət/Zərər (801)

## 3. Valyuta və Kurs Fərqləri (IAS 21)
- **Təsnifat:** Xarici valyuta əməliyyatları tranzaksiya tarixinə olan ARMB məzənnəsi ilə uçota alınır.
- **Yenidən Qiymətləndirmə (Revaluation):** Pul vəsaitləri (104) və öhdəliklər/debitorlar (xarici valyuta üzrə) dövr sonu yenidən qiymətləndirilir.
- **Kurs Fərqləri:** 
    - Müsbət kurs fərqi: **Dr 104 / Cr 631**
    - Mənfi kurs fərqi: **Dr 731 / Cr 104**

## 4. Stok və Maya Dəyəri (IAS 2)
- **Metodlar:** FIFO və AVCO dəstəklənir.
- **Document Loop:** 
    - Alış: **Dr 201, 241 / Cr 531**
    - Satış: **Dr 211 / Cr 601, 542**
    - Maya dəyərinin silinməsi (COGS): **Dr 701 / Cr 201**

## 5. Ay Bağlanışı (Closing)
1. **Gəlir hesablarının bağlanması:** 601, 611 -> 801 (Dr 601 / Cr 801)
2. **Xərc hesablarının bağlanması:** 701, 711, 721 -> 801 (Dr 801 / Cr 701)
3. **Maliyyə nəticəsi:** 801 hesabın qalığı 341 (Bölüşdürülməmiş mənfəət) hesabına ötürülür.

## 6. Vergi Uyğunluğu (Tax Compliance)
- **ƏDV (VAT):** 241 (Əvəzləşdirilən) və 542 (Hesablanan) hesabların uzlaşdırılması.
- **Payroll:** 533 hesab üzrə işçilərdən tutulan Gelir vergisi, DSMF (məcburi dövlət sosial sığorta haqqı), İTS (icbari tibbi sığorta) və İşsizlikdən sığorta haqlarının hesablanması.

## 7. Audit Log və Təhlükəsizlik
- Təsdiq edilmiş sənədlər silinə bilməz.
- Hər bir dəyişiklik `AuditLog` cədvəlində `action`, `user`, `oldValue`, `newValue` və `timestamp` ilə qeyd olunur.

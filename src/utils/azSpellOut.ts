/**
 * Rəqəmi Azərbaycan dilində yazıya çevirir (Manat və Qəpik daxil olmaqla).
 */

const units = ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"];
const tens = ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"];
const hundreds = ["", "yüz", "iki yüz", "üç yüz", "dörd yüz", "beş yüz", "altı yüz", "yeddi yüz", "səkkiz yüz", "doqquz yüz"];
const thousands = ["", "min", "milyon", "milyard", "trilyon"];

function convertGroup(n: number): string {
    let res = "";
    let h = Math.floor(n / 100);
    let t = Math.floor((n % 100) / 10);
    let u = n % 10;

    if (h > 0) res += hundreds[h] + " ";
    if (t > 0) res += tens[t] + " ";
    if (u > 0) res += units[u] + " ";

    return res.trim();
}

/**
 * Məbləği yazıya çevirir.
 * @param amount - Rəqəmlə məbləğ (məs: 125.40)
 * @returns - Yazı ilə məbləğ (məs: Yüz iyirmi beş manat qırx qəpik)
 */
export const azSpellOut = (amount: number | string): string => {
    let num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return "";

    let integerPart = Math.floor(num);
    let decimalPart = Math.round((num - integerPart) * 100);

    let result = "";

    if (integerPart === 0) {
        result = "sıfır manat";
    } else {
        let groups: number[] = [];
        let temp = integerPart;
        while (temp > 0) {
            groups.push(temp % 1000);
            temp = Math.floor(temp / 1000);
        }

        for (let i = groups.length - 1; i >= 0; i--) {
            let groupText = convertGroup(groups[i]);
            if (groupText !== "") {
                if (i === 1 && groups[i] === 1) { // 1000 üçün "bir min" yerinə "min"
                     result += "min ";
                } else {
                     result += groupText + " " + (thousands[i] !== "" ? thousands[i] + " " : "");
                }
            }
        }
        result = result.trim() + " manat";
    }

    if (decimalPart > 0) {
        result += " " + convertGroup(decimalPart) + " qəpik";
    }

    // İlk hərfi böyük edək
    return result.charAt(0).toUpperCase() + result.slice(1);
};

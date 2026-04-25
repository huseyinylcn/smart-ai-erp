const norm = (s) => 
    String(s || '')
        .toLowerCase()
        .replace(/[əeıioöuü]/g, '') // Strip all vowels
        .replace(/[^a-z0-9]/g, '') // Strip all non-alphanumeric
        .trim();

const test = (name, input) => {
    console.log(`${name}: "${input}" -> "${norm(input)}"`);
};

test("Exact Azerbaijani", "SƏNƏD NO");
test("Placeholder Encode", "S?N?D NO");
test("Latin Fallback", "SENED NO");
test("Vowel Shift", "SANAD NU");
test("Spaced", " S  E N E D  NO ");

const target = norm("Sənəd TARİXİ");
console.log(`\nTARGET ("Sənəd TARİXİ"): ${target}`);
const samples = ["S?n?d TARIXI", "SENED TARIXI", "SNDTRX"];
samples.forEach(s => {
    const n = norm(s);
    console.log(`Match "${s}"? -> ${n === target || n.includes(target) || target.includes(n)}`);
});


import fs from 'fs';

const filePath = 'c:\\Users\\Qurba\\.gemini\\antigravity\\scratch\\az-erp\\src\\pages\\hr\\EmployeeHiringCreate.tsx';
const content = fs.readFileSync(filePath, 'utf8');

let divStack = 0;
let errors = [];

const lines = content.split('\n');
lines.forEach((line, i) => {
    const openMatches = line.match(/<div/g) || [];
    const closeMatches = line.match(/<\/div>/g) || [];
    
    divStack += openMatches.length;
    divStack -= closeMatches.length;
    
    if (divStack < 0) {
        errors.push(`Line ${i + 1}: Negative div stack! Too many </div> tags.`);
        divStack = 0;
    }
});

if (divStack > 0) {
    errors.push(`End of file: ${divStack} unclosed <div> tags!`);
}

console.log('JSX Validation Results:');
if (errors.length === 0) {
    console.log('All <div> tags are balanced.');
} else {
    errors.forEach(e => console.log(e));
}

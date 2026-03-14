const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const expressions = new Set();
function findStrings(node) {
    if (typeof node === 'string') {
        if (node.length > 5 && (node.includes('jump') || node.includes('impulse') || node.includes('body'))) {
            expressions.add(node);
        }
    } else if (Array.isArray(node)) {
        node.forEach(child => findStrings(child));
    } else if (node !== null && typeof node === 'object') {
        Object.values(node).forEach(child => findStrings(child));
    }
}
findStrings(data.project[6]); // events
console.log(Array.from(expressions).join('\n'));

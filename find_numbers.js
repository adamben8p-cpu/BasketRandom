const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const numbers = new Set();
function findNumbers(node, path) {
    if (typeof node === 'number') {
        if (Math.abs(node) >= 20) {
            numbers.add(node + ' at ' + path);
        }
    } else if (Array.isArray(node)) {
        node.forEach((child, i) => findNumbers(child, path + '[' + i + ']'));
    } else if (node !== null && typeof node === 'object') {
        Object.keys(node).forEach(key => findNumbers(node[key], path + '.' + key));
    }
}
findNumbers(data.project[6][4], 'events'); // project[6] is events, project[6][4] could be the root event array? wait, let's just search data.project[6]

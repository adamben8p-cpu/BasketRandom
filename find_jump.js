const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

function searchNode(node, path) {
    if (typeof node === 'string') {
        if (node.includes('jump') || node.includes('moreJump')) {
            console.log(path + " -> " + node);
        }
    } else if (Array.isArray(node)) {
        node.forEach((child, index) => searchNode(child, path + '[' + index + ']'));
    } else if (node !== null && typeof node === 'object') {
        Object.keys(node).forEach(key => searchNode(node[key], path + '.' + key));
    }
}

searchNode(data, 'data');

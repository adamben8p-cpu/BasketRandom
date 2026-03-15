const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/adamb/BasketRandom-1/data.json', 'utf8'));

let modified = 0;

// 1. Update Object Type Defaults for 'body*' objects
data.project[3].forEach(obj => {
    if (typeof obj[0] === 'string' && obj[0].startsWith('body')) {
        let vars = obj[3]; // Not obj[1][3], it's obj[3] based on earlier inspection...
        // Wait, earlier I found body Object type array is length 4, and indices are at index 3 ?
        // Actually, let's just recursively search the object for 'jump' and 'moreJump'.
        function scaleVars(n) {
            if (Array.isArray(n)) {
                if (n.length === 4 && typeof n[0] === 'number' && n[1] === 1 && (n[2] === 'jump' || n[2] === 'moreJump')) {
                    console.log('Scaling object type default ' + n[2] + ' from ' + n[3] + ' to ' + (n[3]*3));
                    n[3] *= 3;
                    modified++;
                }
                n.forEach(scaleVars);
            }
        }
        scaleVars(obj);
    }
});

// 2. Update Layout Instance Overrides
function scaleLayouts(layouts) {
    layouts.forEach(layout => {
        if (layout[6] && Array.isArray(layout[6])) {
            layout[6].forEach(layer => {
                if (layer[14] && Array.isArray(layer[14])) {
                    layer[14].forEach(inst => {
                        if (inst[4] && inst[4][0] && Array.isArray(inst[4][0])) {
                            let vars = inst[4][0];
                            for (let i = 0; i < vars.length; i++) {
                                // 50 is the 'jump' override for Player 1.
                                // If they were previously 150 but we reverted, they are back to 50.
                                if (vars[i] === 50) {
                                    console.log('Scaling layout instance jump override from 50 to 150');
                                    vars[i] = 150;
                                    modified++;
                                }
                            }
                        }
                    });
                }
            });
        }
    });
}
scaleLayouts(data.project[5]);

fs.writeFileSync('c:/Users/adamb/BasketRandom-1/data.json', JSON.stringify(data));
console.log('Done, modified: ' + modified);

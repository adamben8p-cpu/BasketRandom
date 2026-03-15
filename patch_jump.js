const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/adamb/BasketRandom-1/data.json', 'utf8'));

// The Object Type UIDs for body, body2, body3, body4
const targetTypes = [1, 30, 35, 38]; 
let modified = 0;

function processLayouts(layouts) {
    layouts.forEach(layout => {
        // layout[6] is layers
        if (layout[6] && Array.isArray(layout[6])) {
            layout[6].forEach(layer => {
                // layer[14] is instances
                if (layer[14] && Array.isArray(layer[14])) {
                    layer[14].forEach(inst => {
                        let typeUid = inst[0][1];
                        if (targetTypes.includes(typeUid)) {
                            if (inst[4] && inst[4][0] && Array.isArray(inst[4][0])) {
                                let vars = inst[4][0];
                                // Index 6 is 'jump', Index 7 is 'moreJump' (if present)
                                // Only process if we see expected values like 50, 8, etc.
                                // Actually, let's just unconditionally multiply index 6
                                // because we already know 6 is the 'jump' instance variable
                                // For Player 1 (type 1), jump is 50. For bots, it's 8.
                                if (typeof vars[6] === 'number') {
                                    console.log('Modifying jump for type ' + typeUid + ' from ' + vars[6] + ' to ' + (vars[6] * 3));
                                    vars[6] *= 3;
                                    modified++;
                                }
                                if (typeof vars[7] === 'number' && vars[7] > 0) {
                                    console.log('Modifying moreJump for type ' + typeUid + ' from ' + vars[7] + ' to ' + (vars[7] * 3));
                                    vars[7] *= 3;
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

// Modify the defaults in Object Types just to be safe (in case instances are spawned dynamically)
data.project[3].forEach(obj => {
    if (typeof obj[0] === 'string' && obj[0].startsWith('body')) {
        let vars = obj[1][3];
        if (vars && Array.isArray(vars)) {
            vars.forEach(v => {
                if (v[2] === 'jump' || v[2] === 'moreJump') {
                    console.log('Modifying default ' + v[2] + ' for ' + obj[0] + ' from ' + v[3] + ' to ' + (v[3] * 3));
                    v[3] *= 3;
                    modified++;
                }
            });
        }
    }
});

processLayouts(data.project[5]);
fs.writeFileSync('c:/Users/adamb/BasketRandom-1/data.json', JSON.stringify(data));
console.log('Total modifications: ' + modified);

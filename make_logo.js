const fs = require('fs');

const svg = `
<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="500" fill="#000000" />
  <path d="M110 270 
           C 110 240, 150 240, 150 200
           C 150 140, 210 140, 210 280
           L 210 370
           C 210 420, 260 420, 260 330
           L 260 150
           C 260 90, 310 90, 310 230
           L 310 320
           C 310 360, 360 360, 360 290
           L 360 250
           C 360 230, 390 230, 390 250"
        stroke="#FFFFFF" stroke-width="40" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>
`;

fs.writeFileSync('public/logo.svg', svg);
fs.writeFileSync('public/favicon.svg', svg);

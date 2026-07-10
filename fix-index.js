import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf-8');

// Update favicons
content = content.replace(
  /<link rel="icon" type="image\/png" href="\/favicon.png" \/>\s*<link rel="icon" type="image\/svg\+xml" href="\/favicon.svg" \/>\s*<link rel="apple-touch-icon" href="\/logo.png" \/>/g,
  `<link rel="icon" href="/favicon.ico" sizes="any">\n    <link rel="icon" href="/favicon.png" type="image/png">\n    <link rel="apple-touch-icon" href="/apple-touch-icon.png">`
);

// Update title and meta description
content = content.replace(
  /<title>Impersio \| Silencly - AI Voice Dictation<\/title>\s*<meta name="title" content="Impersio \| Silencly - AI Voice Dictation" \/>\s*<meta name="description" content="Silencly by Impersio is an AI dictation tool that converts messy thoughts into perfectly formatted text." \/>/g,
  `<title>Impersio | Silencly - AI Voice Dictation</title>\n    <meta name="title" content="Impersio | Silencly - AI Voice Dictation" />\n    <meta name="description" content="AI-powered voice dictation tool that instantly converts your messy thoughts into formatted text." />`
);

// Update Open Graph
content = content.replace(
  /<meta property="og:description" content="Silencly by Impersio is an AI dictation tool that converts messy thoughts into perfectly formatted text." \/>/g,
  `<meta property="og:description" content="AI-powered voice dictation tool that instantly converts your messy thoughts into formatted text." />`
);

// Update Twitter
content = content.replace(
  /<meta property="twitter:description" content="Silencly by Impersio is an AI dictation tool that converts messy thoughts into perfectly formatted text." \/>/g,
  `<meta property="twitter:description" content="AI-powered voice dictation tool that instantly converts your messy thoughts into formatted text." />`
);

// Update structured data
content = content.replace(
  /"logo": "https:\/\/impersio.me\/logo.png"/g,
  `"logo": "https://impersio.me/favicon.png"`
);

content = content.replace(
  /"description": "Silencly by Impersio is an AI-powered dictation tool that instantly converts your messy thoughts into clear, perfectly formatted text.",\s*"offers": {/g,
  `"description": "AI-powered voice dictation tool",\n      "applicationCategory": "ProductivityApplication",\n      "offers": {`
);

fs.writeFileSync('index.html', content);
console.log('Fixed index.html');

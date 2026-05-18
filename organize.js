const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const mayusculas = path.join(srcDir, 'mayusculas');
const minusculas = path.join(srcDir, 'minusculas');
const fonts = path.join(__dirname, 'fonts');
const docs = path.join(__dirname, 'docs');

const dirsToCreate = [srcDir, mayusculas, minusculas, fonts, docs];
dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const originalDir = path.join(__dirname, 'glyphr_svgs');
if (!fs.existsSync(originalDir)) {
    console.error('glyphr_svgs directory not found!');
    process.exit(1);
}

const files = fs.readdirSync(originalDir).filter(f => f.startsWith('gemini_') && f.endsWith('.svg'));

files.forEach(file => {
    // file looks like gemini_A.svg
    const char = file.replace('gemini_', '').replace('.svg', ''); // 'A'
    
    // Copy to mayusculas
    const hexUpper = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    const upperFile = `u${hexUpper}-${char}.svg`;
    fs.copyFileSync(path.join(originalDir, file), path.join(mayusculas, upperFile));
    
    // Copy to minusculas with new name
    const lowerChar = char.toLowerCase();
    const hexLower = lowerChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
    const lowerFile = `u${hexLower}-${lowerChar}.svg`;
    fs.copyFileSync(path.join(originalDir, file), path.join(minusculas, lowerFile));
});

console.log('Archivos organizados exitosamente para LuissFuenteDos.');

const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const fs = require('fs');
const path = require('path');

console.log('Iniciando compilación directa para Fuente_dos...');

const fontStream = new SVGIcons2SVGFontStream({
  fontName: 'Fuente_dos',
  fontHeight: 1000,
  normalize: true
});

let svgContent = '';
fontStream.on('data', chunk => {
  svgContent += chunk;
});

fontStream.on('end', () => {
  console.log('SVGs combinados. Generando TTF...');
  const ttf = svg2ttf(svgContent, {});
  const destPath = path.join(__dirname, 'fonts', 'Fuente_dos.ttf');
  fs.writeFileSync(destPath, Buffer.from(ttf.buffer));
  console.log('¡Fuente TTF generada en ' + destPath + '!');
});

const mayusculasDir = path.join(__dirname, 'src', 'mayusculas');
const minusculasDir = path.join(__dirname, 'src', 'minusculas');

const processDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
    files.forEach(file => {
        // file: u0041-A.svg
        const char = file.split('-')[1].replace('.svg', '');
        console.log(`Añadiendo letra: ${char} desde ${file}`);
        const glyph = fs.createReadStream(path.join(dir, file));
        
        glyph.metadata = {
          unicode: [char],
          name: char
        };
        
        fontStream.write(glyph);
    });
};

processDir(mayusculasDir);
processDir(minusculasDir);

fontStream.end();

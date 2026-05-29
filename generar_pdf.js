const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// ─────────────────────────────────────────
//  CONFIGURACIÓN — editá solo esta sección
// ─────────────────────────────────────────

// Nombre del archivo HTML de entrada (debe estar en la misma carpeta que este script)
const HTML_INPUT = 'reporte_palladium_mayo_2026.html';

// Nombre del PDF de salida (se guarda en la carpeta "output/")
const PDF_OUTPUT = 'reporte_palladium_mayo_2026.pdf';

// ─────────────────────────────────────────

async function generarPDF() {
  const inputPath  = path.resolve(__dirname, HTML_INPUT);
  const outputDir  = path.resolve(__dirname, 'output');
  const outputPath = path.resolve(outputDir, PDF_OUTPUT);

  // Verificar que el HTML existe
  if (!fs.existsSync(inputPath)) {
    console.error(`\n❌ No se encontró el archivo: ${HTML_INPUT}`);
    console.error(`   Asegurate de que el HTML esté en la misma carpeta que este script.\n`);
    process.exit(1);
  }

  // Crear carpeta output si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log('\n⏳ Iniciando generación del PDF...');
  console.log(`   Entrada:  ${HTML_INPUT}`);
  console.log(`   Salida:   output/${PDF_OUTPUT}\n`);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  // Cargar el HTML desde el sistema de archivos
  await page.goto(`file://${inputPath}`, { waitUntil: 'networkidle0' });

  // Esperar a que carguen las fuentes de Google y el gráfico Chart.js
  await page.waitForTimeout(2000);

  // Generar PDF
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,   // imprime colores, gradientes y fondos
    margin: {
      top:    '0mm',
      right:  '0mm',
      bottom: '0mm',
      left:   '0mm',
    },
    preferCSSPageSize: false,
  });

  await browser.close();

  console.log(`✅ PDF generado exitosamente:`);
  console.log(`   ${outputPath}\n`);
}

generarPDF().catch(err => {
  console.error('\n❌ Error al generar el PDF:', err.message, '\n');
  process.exit(1);
});

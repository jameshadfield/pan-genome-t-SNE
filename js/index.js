import '../css/style.css';
import { filesDropped, loadDefaultData } from './filesDropped';
import { runTSNEIters, initialiseTSNE } from './dimensionalReduction';
import { drawScatter, updateScatter, updateScatterData } from './graphing';
import version from './version';

// VARIABLES / CONSTANTS
let repaintNum = 0;
let totalNumRepaints = 50;
const numIterationsPerRepaint = 100;
const additionalRepaintNumber = 50;
let d3info;
let cost = 'N/A';
let taxaNames;

/* users dropping files -> trigger the appropriate loaders ;) */
document.addEventListener('dragover', (e) => {e.preventDefault();}, false);
document.addEventListener('drop', filesDropped, false);
document.addEventListener('keyup', keyIncoming);
document.addEventListener('roaryData', (e) => wrapper(e), false);
document.addEventListener('metadataLoaded', () => {
  updateScatter(taxaNames);
  updateInfo();
});

// let's go..
updateInfo();
window.setTimeout(loadDefaultData, 0);


// FUNCTIONS (hoisted)
function wrapper(e) {
  taxaNames = e.taxaNames;
  const Y = initialiseTSNE(e);
  d3info = drawScatter(e.taxaNames, Y);
  updateInfo();
  // console.log('off to do more iterations...');

  runMoreIterations();
}

function runMoreIterations() {
  repaintNum += 1;
  // console.log('repaint number:', repaintNum);
  let Y;
  [ Y, cost ] = runTSNEIters(numIterationsPerRepaint);
  updateScatterData(taxaNames, Y, d3info);
  // console.log('Y[0] = ', Y[0][0], Y[0][1]);
  // document.getElementById('progress').innerHTML = '<p>iteration ' + repaintNum * 100 + ' / ' + totalNumRepaints * 100 + '</p>';
  updateInfo();


  if (repaintNum < totalNumRepaints) {
    window.requestAnimationFrame(runMoreIterations);
  }
}

function updateInfo() {
  // const roaryName = window.roaryFile || 'not loaded';
  // const metadataFileName = window.metadata ? window.metadata.fileName : 'not loaded';
  // const metadataColumnName = window.metadata ? window.metadata.headerNames[window.metadata.colToUse] : 'N/A';

  const auth = 'pan genome t-SNE // james hadfield // version ' + version;
  const roary = window.roaryFile ? window.roaryFile : 'Drag on some ROARY results (gene_presence_absence.csv file)';
  const meta = window.metadata ? window.metadata.fileName : '[optional] Drag on a CSV file linking taxa with metadata.';
  const metaColumn = window.metadata ? window.metadata.headerNames[window.metadata.colToUse] + ' (press 1-9 to change)' : 'N/A';
  const iterCount = repaintNum * numIterationsPerRepaint + ' / ' + totalNumRepaints * numIterationsPerRepaint
    + ', cost = ' + cost
    + ' (press m to run ' + numIterationsPerRepaint * additionalRepaintNumber + ' more)';

  const el = document.getElementById('info');
  el.innerHTML = '<p>' + auth + '</p>'
    + '<p>ROARY data: ' + roary + '</br>'
    + 'metadata: ' + meta + '</br>'
    + 'metadata column: ' + metaColumn + '</br>'
    + 'num t-SNE iterations: ' + iterCount + '</p>';
}

function keyIncoming(event) {
  const key = event.keyCode || event.charCode;
  // console.log('key press. Code =', key);
  if (window.metadata) {
    if (key >= 49 && key <= 57) {
      window.metadata.colToUse = key - 49;
      updateScatter(taxaNames);
      updateInfo();
    } else if (key === 77) { // m
      totalNumRepaints += additionalRepaintNumber;
      runMoreIterations();
    }
  }
}

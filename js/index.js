import '../css/style.css';
import { filesDropped, loadDefaultData } from './filesDropped';
import { runTsns } from './dimensionalReduction';
import { drawScatter, updateScatter } from './graphing';

/* users dropping files -> trigger the appropriate loaders ;) */
document.addEventListener('dragover', (e) => {e.preventDefault();}, false);
document.addEventListener('drop', filesDropped, false);
document.addEventListener('keyup', keyIncoming);
document.addEventListener('roaryData', (e) => wrapper(e), false);
document.addEventListener('metadataLoaded', () => {
  updateScatter(window.taxaNames);
  updateInfo();
});

const numTSNEIters = 5000;
updateInfo();
window.setTimeout(loadDefaultData, 0);

function wrapper(e) {
  const Y = runTsns(e, numTSNEIters);
  window.taxaNames = e.taxaNames; // EEK!!!
  drawScatter(e.taxaNames, Y);
  updateInfo();
}

function updateInfo() {
  const roaryName = window.roaryFile || 'not loaded';
  const metadataFileName = window.metadata ? window.metadata.fileName : 'not loaded';
  const metadataColumnName = window.metadata ? window.metadata.headerNames[window.metadata.colToUse] : 'N/A';

  const auth = '<p>pan genome t-SNE // james hadfield // version 0.1</p>';
  const el = document.getElementById('info');

  if (roaryName === 'not loaded' && metadataFileName === 'not loaded') {
    el.innerHTML = auth
      + '<p><strong>how to use:</strong></br>'
      + 'Drag on some ROARY results (gene_presence_absence.csv file) '
      + 'and (optionally) a CSV file linking taxa with metadata.</br>'
      + 'The metadata is used to colour the plots on the scatterplot</br>'
      + 'Pressing 1-9 cycles through metadata columns</p>'
      + '<p>Currently ' + numTSNEIters + ' iterations will be run, which may be slow (check the javascript console to see progress)</p>';
  } else {
    el.innerHTML = auth
      + '<p>ROARY data: ' + roaryName + '</br>'
      + 'metadata: ' + metadataFileName + '</br>'
      + 'metadata column: ' + metadataColumnName + '</br>'
      + 'num t-SNE iterations: ' + numTSNEIters + '</p>';
  }
}

function keyIncoming(event) {
  const key = event.keyCode || event.charCode;
  // console.log('key press. Code =', key);
  if (window.metadata) {
    if (key >= 49 && key <= 57) {
      window.metadata.colToUse = key - 49;
      updateScatter(window.taxaNames);
      updateInfo();
    }
  }
}

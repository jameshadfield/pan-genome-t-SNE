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

  const el = document.getElementById('info');
  el.innerHTML = '<p>pan genome t-SNE // james hadfield // version 0.1</p>'
    + '<p>ROARY data: ' + roaryName + '</br>'
    + 'metadata: ' + metadataFileName + '</br>'
    + 'metadata column: ' + metadataColumnName + '</br>'
    + 'num t-SNE iterations: ' + numTSNEIters + '</p>';
}

function keyIncoming(event) {
  // console.log('keyIncoming triggered');
  if (window.metadata) {
    const key = event.keyCode || event.charCode;
    if (key >= 49 && key <= 57) {
      window.metadata.colToUse = key - 49;
      updateScatter(window.taxaNames);
      updateInfo();
    }
  }
}

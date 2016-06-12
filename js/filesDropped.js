import { roaryParser } from './roaryParser';
import { metaParser } from './metadataParser';
// import { getDefaultMetadata, getDefaultRoaryData } from './defaultData';

export function loadDefaultData() {
  // console.log('default data not available!');
  // dealWithMetadata(getDefaultMetadata(), 'test set');
  // dealWithRoaryData(getDefaultRoaryData(), 'test set');
}

const fileReaderPromise = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {resolve(e.target.result);}; // onload callback resolves
  reader.onerror = (e) => {reject('File ' + file.name + ' could not be read! Code ' + e.target.error.code);};
  reader.readAsText(file);
});

export function filesDropped(e) {
  const files = e.dataTransfer.files;
  e.preventDefault();
  // console.log(files);
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i].name;
    console.log('file dropped!', fileName);
    const fileExtension = fileName.split('.').slice(-1)[0].toLowerCase();
    if (fileExtension !== 'csv') {
      console.log('don\'t know what to do with this file!');
      return;
    }
    fileReaderPromise(files[i]).then( (success) => {
      if (success.startsWith('"Gene","Non-unique Gene name"') || success.startsWith('Gene,Non-unique Gene name')) { // ROARY
        dealWithRoaryData(success, fileName);
      } else {
        dealWithMetadata(success, fileName);
      }
      return;
    }).catch( (failure) => {
      console.log(failure.toString());
    });
  }
}

function dealWithRoaryData(data, fileName) {
  const [ taxaNames, blockMatrix ] = roaryParser(data);
  const roaryEvent = new Event('roaryData');
  roaryEvent.taxaNames = taxaNames;
  roaryEvent.blockMatrix = blockMatrix;
  window.roaryFile = fileName; // EEK!!!!!
  document.dispatchEvent(roaryEvent);
}

function dealWithMetadata(data, fileName) {
  const metadata = metaParser(data);
  // metadata keys: { data, values, colours, headerNames, info, toggles, groups }
  // console.log('metadata:', metadata);
  metadata.colToUse = 0;
  window.metadata = metadata; // EEK!
  window.metadata.fileName = fileName;
  document.dispatchEvent(new Event('metadataLoaded'));
}


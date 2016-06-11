import Papa from 'papaparse';

export function roaryParser(csvString) {
  const papa = Papa.parse(csvString);
  // console.log(papa);
  const blockMatrix = [];
  const taxaNames = [];

  // different columsn for diff taxon
  // rows are the gene groups
  for (let taxaColIdx = 11; taxaColIdx < papa.data[0].length; taxaColIdx++) {
    taxaNames.push(papa.data[0][taxaColIdx]);
    const tmp = [];
    for (let rowIdx = 1; rowIdx < papa.data.length; rowIdx++) {
      tmp.push(papa.data[rowIdx][taxaColIdx] ? 1 : 0);
    }
    blockMatrix.push(tmp);
  }

  return ([ taxaNames, blockMatrix ]);

  // console.log(taxaNames);
  // console.log(blockMatrix);
}


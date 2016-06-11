
export function runTsns(e, numSteps) {
  // console.log(e.taxaNames);
  // console.log(e.blockMatrix);
  const opt = { epsilon: 10 }; // epsilon is learning rate (10 = default)
  const tsne = new tsnejs.tSNE(opt); // create a tSNE instance
  tsne.initDataDist(e.blockMatrix);
  // const svg = drawEmbedding(tsne, e.taxaNames); // draw initial embedding

  // setInterval(() => {
  //   tsne.step();
  //   updateEmbedding(svg, tsne, e.taxaNames);
  // }, 0);

  for (let k = 0; k < numSteps; k++) {
    console.log('tsne step', k, '/', numSteps);
    tsne.step(); // every time you call this, solution gets better
    // modifyBanner('computing t-SNE step', k, 'of', numSteps);

    // updateEmbedding(svg, tsne, e.taxaNames);
  }

  const Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
  // console.log(Y);

  scaleDataPoints(Y); // modifies Y in place

  return Y;
}


function scaleDataPoints(Y) {
  console.log('applying scaling to data points');
  let xMin = Math.min.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][0]));
  let yMin = Math.min.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][1]));
  let xMax = Math.max.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][0]));
  let yMax = Math.max.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][1]));

  // console.log('yMin', yMin, 'yMax', yMax, 'xMin', xMin, 'xMax', xMax);

  const scalar = Math.min(xMin, yMin);

  for (let i = 0; i < Y.length; i++) {
    Y[i][0] = Y[i][0] / scalar;
    Y[i][1] = Y[i][1] / scalar;
  }

  // xMin = Math.min.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][0]));
  // yMin = Math.min.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][1]));
  // xMax = Math.max.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][0]));
  // yMax = Math.max.apply(null, Array(...Array(Y.length)).map((x, idx) => Y[idx][1]));

  // console.log('yMin', yMin, 'yMax', yMax, 'xMin', xMin, 'xMax', xMax);

}

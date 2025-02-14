onmessage = (event) => {
  // event.data : {scope: [[name, prom]], filename: string}
  event.data.scope.forEach(element => {
    let [name, prom] = element;
    // set global variables to bind the imported instances
    self[name] = Promise.resolve(prom);
  });

  let fname = event.data.filename;
  importScripts("testharness.js", "async_index.js", "../../../../" + fname);
  chain.then(
    _ => {
      console.log(`Worker ${fname} posted done`);
      postMessage({type: "done"});
    },
    reason => {
      console.log(`Worker ${fname} failed due to ` + reason)
      postMessage({type: "failed"})
    });
};

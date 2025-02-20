onmessage = (event) => {
  // event.data : {scope: [[name, exports]], filename: string}
  event.data.scope.forEach(element => {
    let [name, exports] = element;
    // set global variables to bind the imported instances
    self[name] = Promise.resolve(exports);
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

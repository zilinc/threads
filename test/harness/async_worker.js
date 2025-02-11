importScripts("testharness.js", "testharnessreport.js");

onmessage = (event) => {
  // event.data : {scope: [[name, prom]], filename: string}
  event.data.scope.forEach(element => {
    let [name, prom] = element;
    // set global variables to bind the imported instances
    self[name] = Promise.resolve(prom);
  });

  let fname = event.data.filename;
  importScripts(fname);
  chain.then(
    _ => {
      console.log(`Worker ${fname} done.`);
      postMessage({type: "done"});
    },
    reason => {
      console.log(`Worker ${fname} failed due to` + reason)
      postMessage({type: "failed"})
    });
};

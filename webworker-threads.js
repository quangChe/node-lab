const express = require('express');
const app = express();
const crypto = require('crypto');
const Worker = require('webworker-threads').Worker;

app.get('/', (req, res) => {
  // Worker Thread
  const worker = new Worker(function() {
    this.onmessage = function() {
      // This runs on worker.postMessage() below

      let counter = 0;
      while (counter < 1e9) {
        counter++
      }
      postMessage(counter);
    }

  });

  // Application interface - runs on webworker's .postMessage()
  worker.onmessage = function(message) {
    console.log(message.data);
    res.send(message.data.toString());
  }
  worker.postMessage(); //

})

app.get('/fast', (req, res) => {
  res.send('This is fast!');
})

app.listen(3000, () => console.log('Listening on port 3000!'));



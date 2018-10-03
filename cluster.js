const cluster = require('cluster');

// If this is the cluster manager instance
if (cluster.isMaster) {
  // Cause index.js to be executed *again* in child mode
  cluster.fork(); 
  cluster.fork(); 
  cluster.fork(); 
  // cluster.fork(); 
  // cluster.fork(); 
  // cluster.fork(); 
} else {
  // Child mode: act like a server and do nothing else
  process.env.UV_THREADPOOL_SIZE = 1;
  const express = require('express');
  const app = express();
  const crypto = require('crypto');

  app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hello world!');
    });
  })

  app.get('/fast', (req, res) => {
    res.send('This is fast!');
  })
  
  app.listen(3000, () => console.log('Listening on port 3000!'));
}


// Combining all 3 processes
// - Pending timers (Node.js event loop on v8 - 1 thread), 
// - Pending OS tasks (Macbook 2cores * 4threads/core = 8 threads),
// - Pending long-running operations (libuv threadpool - 4 threads)
process.env.UV_THREADPOOL_SIZE = 5;
const https = require('https');
const crypto = require('crypto');
const fs = require('fs'); // Filesystem module to read files off harddrive

const start = Date.now();

const doRequest = () => {
  https.request('https://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => console.log('HTTP:', Date.now() - start));
  }).end();
};

const doHash = () => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log('Hash:', Date.now() - start);
  });
}

doRequest();

fs.readFile('multitask.js', 'utf8', () => {
  console.log('FS:', Date.now() - start);
})

doHash();
doHash();
doHash();
doHash();
doHash();

// doRequest() uses OS so it isn't queued with other functions and therefore
// runs immedieately.

// Threadpool has to handle Filesystem module and 4 doHash()--5 processes total

// Filesystem function delayed because it is a more roundabout process:
  // - Call fs.readFile
  // - Node gets stats on the file (require HD access)
  // - HD accessed and returns stats to Node
  // - Node requests to read the file
  // - HD accessed and file contents returns to Node
  // - Node returns file contents to us

// Threadpool only has 4 threads by default!
// Thus, the thread that handles the FS then frees up itself to run the 4th doHash()
// while waiting for Hard drive to be accessed

// Eventually one of the other threads finishes the doHash() first and so that
// callback gets executed

// THEN, that thread is free and so it checks other pending long-running operations
// that aren't being attended to. It takes up the FS function finishes it up since there is 
// no other pending functions it can take up.
  // If we were to add another doHash(), then it would actually take up another task
  // while it waits as well, and FS function would be delayed once again 
  // (try with 4 and 5 doHash())
    // However, if we change process.env.UV_THREADPOOL_SIZE = 5, then FS moves up one step
    // TRY IT!
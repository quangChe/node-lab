// Proof Node.js is not really single-threaded
const crypto = require('crypto');

const start = Date.now();

// Step 1: Takes ~1 sec
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('1:', Date.now() - start);
});

// Step 2: Takes ~1 sec
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('2:', Date.now() - start);
});

crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('3:', Date.now() - start);
});


crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('4:', Date.now() - start);
});

// Slight delay here because exceeds the 4 threads in libuv's thread pool
crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
  console.log('5:', Date.now() - start);
});

// Steps 1 & 2 complete at about same time meaning step 2 runs on
// a different thread than step 1

// These functions are running outside Node.js event loop,
// going beyond v8 engine and using libuv engine (Node's C++ side) to run 
// expensive functions as well using a THREAD POOL (4 threads)

// In addition to the event loop (1 thread) Node.js has 4 threads from
// the thread pool in its libuv engine that can offload expensive functions
// from the event loop
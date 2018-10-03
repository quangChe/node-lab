 // node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = []; // Threadpool processes

// New timers, tasks, operations are recorded from running of myFile
myFile.runContents();

// Checks if Node should continue or exit event loop (back to terminal)
function shouldContinue() {
  // Check one: Any pending setTime, setInterval, setImmediate?
  // Check two: Any pending OS tasks? (Like server listening to port)
  // Check three: Any pending long-running operations? (Like filesystem module)

  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length
}

// Entire body executes in one 'tick'
while(shouldContinue()) {
  // 1. Node looks at pendingTimers and sees if any 
  // functions are ready to be called. (setTimeout, setInterval)
  
  // 2. Node looks at pendingOSTasks and pendingOperations and 
  // calls relevant callbacks
  
  // 3. Node pauses execution and continue when:
    // - a new pendingOSTask is done
    // - a new pendingOPeration is done
    // - a timer is about to complete

  // 4. Node looks at pendingTimers again. (setImmediate)
}



// exit back to terminal
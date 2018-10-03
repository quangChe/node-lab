// pendingOSTasks--pretty much any network-related operations/functions will 
// be offloaded to OS task 
const https = require('https');

const start = Date.now();

const doRequest = () => {
  https.request('https://www.google.com', res => {
    res.on('data', () => {});
    res.on('end', () => console.log(Date.now() - start));
  }).end();
};

doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();
doRequest();

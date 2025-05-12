const path = require('path');
const gateway = require('express-gateway');

// path.join(__dirname, 'config') will point to the /api-gateway/config directory
gateway()
  .load(path.join(__dirname, 'config'))
  .run();

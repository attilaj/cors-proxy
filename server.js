// Listen on a specific host via the HOST environment variable 
const host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PORT || 8080;

// Hardcoded whitelist (add your domain here)
const originWhitelist = [
  'http://videoadbreaks.com',
  'https://videoadbreaks.com',
  'http://localhost:3000' // optional: local testing
];

// Set up rate-limiting to avoid abuse of the public CORS Anywhere server
const checkRateLimit = require('./lib/rate-limit')(process.env.CORSANYWHERE_RATELIMIT);

const cors_proxy = require('./lib/cors-anywhere');

cors_proxy.createServer({
  originBlacklist: [], // keep empty or customize
  originWhitelist: originWhitelist,
  requireHeader: ['origin', 'x-requested-with'],
  checkRateLimit: checkRateLimit,
  removeHeaders: [
    'cookie',
    'cookie2',
    'x-request-start',
    'x-request-id',
    'via',
    'connect-time',
    'total-route-time',
  ],
  redirectSameOrigin: false, // 🔥 This is crucial to avoid preflight redirect issues
  httpProxyOptions: {
    xfwd: false,
  },
}).listen(port, host, function () {
  console.log('✅ CORS Anywhere is running on ' + host + ':' + port);
});

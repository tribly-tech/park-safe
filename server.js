const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3001;

// Initialize Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Try to load SSL certificates
  let httpsOptions;
  const certPath = path.join(__dirname, 'certificates', 'localhost.pem');
  const keyPath = path.join(__dirname, 'certificates', 'localhost-key.pem');

  try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.log('✅ SSL certificates found, starting HTTPS server...');
    } else {
      console.log('⚠️  SSL certificates not found. Run setup-https.sh first.');
      console.log('   Falling back to HTTP (camera won\'t work)');
    }
  } catch (error) {
    console.log('⚠️  Error loading SSL certificates:', error.message);
    console.log('   Falling back to HTTP (camera won\'t work)');
  }

  if (httpsOptions) {
    // Create HTTPS server
    createServer(httpsOptions, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log('');
      console.log('🚀 Park Safe is running with HTTPS!');
      console.log('');
      console.log(`   Local:            https://localhost:${port}`);
      console.log(`   Network:          https://${getLocalIP()}:${port}`);
      console.log('');
      console.log('✅ Camera access enabled (HTTPS active)');
      console.log('');
    });
  } else {
    // Fallback to HTTP (require('http') instead)
    const { createServer: createHTTPServer } = require('http');
    createHTTPServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    }).listen(port, hostname, (err) => {
      if (err) throw err;
      console.log('');
      console.log('⚠️  Park Safe is running with HTTP (not recommended)');
      console.log('');
      console.log(`   Local:            http://localhost:${port}`);
      console.log(`   Network:          http://${getLocalIP()}:${port}`);
      console.log('');
      console.log('❌ Camera access blocked (HTTPS required)');
      console.log('   Run: chmod +x setup-https.sh && ./setup-https.sh');
      console.log('');
    });
  }
});

// Get local IP address
function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal and non-IPv4 addresses
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        return net.address;
      }
    }
  }
  
  return 'localhost';
}

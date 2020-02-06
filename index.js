const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

// Args
const args = require('minimist')(process.argv.slice(2));

const port = args.port || 8090;

// Confs
const conf = require('./conf.json');

const routes = {};

Object.keys(conf).forEach(routeKey => {
  if (args[routeKey] && routeKey !== 'front' && routeKey !== 'dev') {
    routes[conf[routeKey].path] = conf[routeKey];
  }
});

routeFront = (req, res) => {
    if (args.front) {
        return conf.front;
    }
    return conf.dev;
}

routeBack = (req, res) => {
    let confRoute;
    Object.keys(routes).forEach(routeKey => {
      if (req.url.startsWith(routeKey)) {
        confRoute = routes[routeKey];
      }
    });
    return confRoute || conf.dev;;
}

handleRoute = (req, res) => {
  const callProxy = ({target, path, replace}) => {
    if (replace) {
      req.url = req.url.replace(path, replace);
    }
    proxy.web(req, res, {target});
  };
  let confRoute;
  if (req.url.startsWith('/api')) { //back
    confRoute = routeBack(req, res);
  } else { //front
    confRoute = routeFront(req, res);
  }
  callProxy(confRoute);
}

handleError = (err, req, res) => {
    console.error(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
}

console.log('Listening port '+port);

console.group('Configuration:');
const table = [];

Object.keys(routes).forEach(routeKey => {
  table.push(routes[routeKey]);
});

table.push({path: '/api/*', ...conf.dev});
if (args.front) {
  table.push({path: '*', ...conf.front});
} else {
  table.push({path: '*', ...conf.dev});
}

console.table(table);
console.groupEnd();
console.log();

// Start
// Create server
http.createServer(handleRoute).listen(port);

// Listen for the `error` event on `proxy`.
proxy.on('error', handleError);

console.group('Requests:');
//
// Listen for the `proxyReq` event on `proxy`.
//
proxy.on('proxyReq', function (proxyReq, req, res) {
  console.log(proxyReq.method+'\t'+proxyReq.path);
});


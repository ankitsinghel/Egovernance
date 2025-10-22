const http = require('http');
const url = 'http://localhost:3000/super-admin/login';
http.get(url, res => {
  console.log('status', res.statusCode);
  console.log(res.headers);
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => console.log('body len', body.length));
}).on('error', e => console.error('err', e.message));

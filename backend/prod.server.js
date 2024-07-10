const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const csrf = require('xsrf');

const registerRouter = require('./router');

const port = process.env.PORT || 9002;

const app = express();

const csrfProtection = csrf({
  cookie: true,
  ignoreMethods: ['HEAD', 'OPTIONS'],
  checkPathReg: /^\/api/
});
app.use(cookieParser());
app.use(csrfProtection);
app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return next();
});

registerRouter(app);
app.use(compression());

app.use(express.static('./dist'));

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next();
  }

  // handle CSRF token errors here
  res.status(403);
  res.send('<p>接口已经被我用 CSRF 保护了，请参考课程用自己的服务器代理接口</p><p>如果你还未购买课程并想学习课程的话，请去慕课网购买<a href="https://coding.imooc.com/class/107.html">正版课程</a>，不仅可以学到很多硬货知识，更有机会加我微信喔~</p><p>课程项目<a href="http://ustbhuangyi.com/music">体验地址</a>，也可扫码访问</p><img src="data:image/png;base64,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"></img>');
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});

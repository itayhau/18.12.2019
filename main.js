1.
try:
console.log(window)

ReferenceError: window is not defined

Why? Because it is not running in browser

2.
global.console.log("hello!")
This is the same as window object in browser…

3.
console.log(global)

4.
Global functions:
setTimeOut()
clearTimeOut()
setInterval()
clearInterval()

5.
var x = 5
console.log(global.x)

Undefined: node does not places values/functions on global (in oppose to window)

6.
console.log(module)
Module {
  id: '.', // unique id
  exports: {}, // export appear his!!!!!!!!!!!!
  parent: null,
  filename: 'E:\\work\\bottomline\\18.04\\nodejs\\start\\app.js', //path
  loaded: false, // loaded or not
  children: [],
  paths:
   [ 'E:\\work\\bottomline\\18.04\\nodejs\\start\\node_modules',
     'E:\\work\\bottomline\\18.04\\nodejs\\node_modules',
     'E:\\work\\bottomline\\18.04\\node_modules',
     'E:\\work\\bottomline\\node_modules',
     'E:\\work\\node_modules',
     'E:\\node_modules' ] }

7.
Create logger.js
var url = 'http://mylogger.io/log'

function log(message) {
   // send HTTP
   console.log(`Logging: ${message}`);
}

module.exports.log = log;
module.exports.endPoint = url;

app.js
// better use const to avoid overwriting it
const logger = require('./logger') // or:  require('logger.js")
console.log(logger)
logger.log(“Hello world!”)

{ log: [Function: log], endPoint: 'http://mylogger.io/log' }
Logging: Hello world!

8.
Nice tool: jshint

npm install -g jshint

Change code to:
const logger = require('./logger') // or:  require('logger.js")
console.log(logger)
logger.log("Hello world!")
logger = 2

jshint app.js

E:\work\bottomline\18.04\nodejs\start>jshint app.js
app.js: line 1, col 1, 'const' is available in ES6 (use 'esversion: 6') or Mozilla JS extensions (use moz).
app.js: line 1, col 35, Missing semicolon.
app.js: line 2, col 20, Missing semicolon.
app.js: line 3, col 27, Missing semicolon.
app.js: line 4, col 11, Missing semicolon.
app.js: line 4, col 1, Attempting to override 'logger' which is a constant.

6 errors

9.
Export only a method

logger.js
var url = 'http://mylogger.io/log'
function log(message) {
   // send HTTP
   console.log(`Logging: ${message}`);
}
module.exports = log;

app.js
const log= require('./logger') // or:  require('logger.js")
console.log(logger)
log("Hello world!")

10.
Explore module:
Logger.js
var x =;
const logger = require('./logger') // or:  require('logger.js")
console.log(logger)
logger("Hello world!")

E:\work\bottomline\18.04\nodejs\start\app.js:1
(function (exports, require, module, __filename, __dirname) { var x =;}

Node wrap the logger.js wrap into a function

Logger.js
The code actually looks something like this:
(function (exports, require, module, __filename, __dirname)
{
var url = 'http://mylogger.io/log'
function log(message) {
   // send HTTP
   console.log(`Logging: ${message}`);
}
module.exports = log;
//module.exports.endPoint = url; // delete?
})()
This is why we have require! Because it is part of every module signature!

__filename = this complete path to the file name
__dirname = the path of the file

Logger.js
console.log(__filename)
console.log(__dirname)
var url = 'http://mylogger.io/log'
function log(message) {
   // send HTTP
   console.log(`Logging: ${message}`);
}
module.exports = log;

E:\work\bottomline\18.04\nodejs\start\logger.js
E:\work\bottomline\18.04\nodejs\start

11.
Browse to Module path > parse
App.js
const path = require('path'); // built in modules do not require ./ or ../
console.log(path)

{ root: 'E:\\',
  dir: 'E:\\work\\bottomline\\18.04\\nodejs\\start', // containing folder
  base: 'app.js',
  ext: '.js',
  name: 'app' }

12.
App.js
const os = require('os');
console.log(`Free Memory: ${os.freemem()}`)
console.log(`Total  Memory: ${os.totalmem()}`)

Free Memory: 13070708736
Total  Memory: 34216902656

13.
App.js
Start with sync
const fs = require('fs')
const files = fs.readdirSync('./') // sync -- bad!!!!
console.log(files)

[ 'app.js', 'logger.js' ]

Let’s test the async
fs.readdir('./', (err, files) => {
   if (err) console.log(`Error ${err}`)
   else console.log(`Files ${files}`)
})

Files app.js,logger.js

Let’s test the error
fs.readdir('$', (err, files) => {
   if (err) console.log(`Error ${err}`)
   else console.log(`Files ${files}`)
})

Error Error: ENOENT: no such file or directory, scandir 'E:\work\bottomline\18.04\nodejs\start\$'

14.
App.js
const EventEmitter = require('events'); // convension that EventEmitter is a class (container)
const emitter = new EventEmitter();
emitter.emit(); // emit = making a noise, or produce something.
// here you make a noise - that something has happend
// --- register a listener (must come first)
emitter.on('messageLogged', () => {
   console.log('listener called')
})
// --- raise an event
emitter.emit('messageLogged')

listener called

Now add parameters:
const EventEmitter = require('events'); // convension that EventEmitter is a class (container)
const emitter = new EventEmitter();
emitter.emit(); // emit = making a noise, or produce something.
// here you make a noise - that something has happend
// --- register a listener
emitter.on('messageLogged', ({ id, url}) => {
   console.log(`listener called id:${id} url:${url}`)
})
// --- raise an event
emitter.emit('messageLogged', { id: 1 , url:'http://mysite.org'})

listener called id:1 url:http://mysite.org

Exercise: add event to logger
Solution:
App.js
const logger = require('./logger') // or:  require('logger.js")
const EventEmitter = require('events'); // convension that EventEmitter is a class (container)
const emitter = logger.emitter;
// --- register a listener
emitter.on('messageLogged', ({ id, url}) => {
   console.log(`listener called id:${id} url:${url}`)
})
logger.log('message')

Logger.js
const EventEmitter = require('events'); // convension that EventEmitter is a class (container)
const emitter = new EventEmitter();
var url = 'http://mylogger.io/log'
function log(message) {
   // --- raise an event
   emitter.emit('messageLogged', { id: 1 , url:'http://mysite.org'})
   console.log(`Logging: ${message}`);
}
module.exports.log = log;
module.exports.emitter = emitter

listener called id:1 url:http://mysite.org
Logging: message


Better solution:
App.js
const Logger = require('./logger') // or:  require('logger.js")
// --- register a listener
const logger = new Logger()
logger.on('messageLogged', ({ id, url}) => {
   console.log(`listener called id:${id} url:${url}`)
})
logger.log('message')

Logger.js
const EventEmitter = require('events'); // convension that EventEmitter is a class (container)
const emitter = new EventEmitter();

var url = 'http://mylogger.io/log'

class Logger extends EventEmitter {
   log(message) {
       this.emit('messageLogged', { id: 1 , url:'http://mysite.org'})
       console.log(`Logging: ${message}`);
   }
}
module.exports = Logger;

listener called id:1 url:http://mysite.org
Logging: message

15.
App.js
const http = require('http')
const server = http.createServer(); // it is an event emitter. it has on, emit
server.on('connection', (socket, error) => {
   console.log('new connection')
})
server.listen(8080); // port 8080
console.log('Listening to port 8080');

Now browse to localhost:8080
And see console message

Listening to port 8080
new connection
new connection
new connection

Now improve the code:
App.js
const http = require('http')
const server = http.createServer((req, res) => {
   console.log(req.url)
   if (req.url == '/') {
       res.write('Hello World!');
       res.end();
   }
});
server.listen(8080); // port 8080
console.log('Listening to port 8080');

Now browse to localhost:8080

Let’s add another url:
App.js
const http = require('http')
const server = http.createServer((req, res) => {
   console.log(req.url)
   if (req.url == '/') {
       res.write('Hello World!');
       res.end();
   }
   if (req.url == '/api/courses') {
       res.write(JSON.stringify(
           [{ id : 1, title: "music"},
            { id : 2, title: "Computers"},
            { id : 3, title: "driving"},
            { id : 4, title: "dancing"},
           ]

       ));
       res.end();
   }
});
server.listen(8080); // port 8080
console.log('Listening to port 8080');

Now browse to localhost:8080/api/courses

In real world we will use Express

16.
Express:
See ppt, browse to www.npmjs.com
Type express in search bar
Npm install express
Add demo code to app.js:
var express = require('express')
var app = express()
app.get('/', function (req, res) {
 res.send('Hello World')
})
app.listen(8080)

Now browse to localhost:8080/

17.
const _ = require('lodash');

const numbers = [550, 35, 67, 23, 23, 4, 2, 16]

_.each(numbers, (number, index) => {
   console.log(number)
})
18.
{
 "name": "start",
 "version": "1.0.0",
 "description": "",
 "main": "app.js",
 "dependencies": {
   "express": "^4.16.4",
   "live-server": "^1.2.1",
   "loadash": "^1.0.0",
   "lodash": "^4.17.11"
 },
 "devDependencies": {},
 "scripts": {
   "start": "node app.js",
   "server":"live-server"
 },
 "keywords": [],
 "author": "",
 "license": "ISC"
}


18.
19.
20.
21.
22.
23.
24.
25.
26.
27.
28.
29.
30.














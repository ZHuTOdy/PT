// 为日志添加时间显示前缀
// 建立日志文件 /var/log/nodejs/应用名-YYYY-MM-DD.log
// Windows系统下日志文件位于当前磁盘的 \var\log\nodejs 目录
if (! ''.red)
     require('tinycolor');
var ospath = require('path');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var moment = require('moment');
var sprintf = require("sprintf-js").sprintf;

process.env.app = process.env.app || ospath.basename(__dirname);
process.env.log_path = process.env.log_path || '/var/log/nodejs/';

//moment.locale('zh-cn');

if ('-' !== process.env.log_path) {
    mkdirp.sync(process.env.log_path);
}

var log_queue = async.queue(function (task, callback) {
    fs.appendFile(task.logfile, task.text, function (err) {
        if (err) {
            // func.call(console, task.prefix, ('can not write to logfile ' + logfile), err);
        }
        setTimeout(callback);
    });
}, 1);

var colors = {log: 'grey', info:'white', warn:'yellow', error:'red'};
['log', 'info', 'warn', 'error'].forEach(function (fn) {
    console[fn] = function() {
        var now = moment();
        var prefix = (now.format('YYYY-MM-DD HH:mm:ss') + sprintf(' %-5s %s(%d) ', this.level, __file, __line))[colors[this.level]];
        var args = Array.prototype.slice.call(arguments, 0);
        var result;
        if (undefined !== this.orig) {
            result = this.orig.apply(console, [prefix].concat(args));
        }
        if ('-' === process.env.log_path) {
            return result;
        }

        var logfile = sprintf('%s%s-%s.log', process.env.log_path, process.env.app, now.format('YYYY-MM-DD'));
        var cmd = args.shift();
        for(var i =0; i < args.length; i++){
            if ('object' === typeof args[i]) {
                args[i] = JSON.stringify(args[i]);
            }
        }
        var text = sprintf('%s %s %s\n', prefix, cmd, args.join(' ')).replace(/\x1b\[\d+m/g, '');
        log_queue.push({logfile: logfile, text: text, prefix: prefix, func: this.orig});
/*

        var func = this.orig;
        fs.appendFile(logfile, text, function (err) {
            if (err) {
                func.call(console, prefix, ('can not write to logfile ' + logfile), err);
            }
        });
*/
        return result;
    }.bind({level: fn, orig: console[fn]});
});

Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

global.stack_pos = global.stack_pos || 2;

Object.defineProperty(global, '__line', {
    get: function() {
        return __stack[global.stack_pos].getLineNumber();
    }
});

Object.defineProperty(global, '__file', {
    get: function() {
        return (__stack[global.stack_pos].getFileName() || '').replace(__dirname + ospath.sep, '').replace(/\\/g, '/');
    }
});

setTimeout(function(){
    // console.info('shell_encoding:', process.env.shell_encoding);
    if ('-' === process.env.log_path) {
        console.info('log: disabled');
    } else {
        // console.info('process.env.log_path:', process.env.log_path  );
        console.info('log:', process.env.log_path + process.env.app + '-YYYY-MM-DD.log' );
    }
}, 0);

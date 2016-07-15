#!/usr/bin/env node
'use strict';
var program = require('commander');
var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment');
var chalk = require('chalk');

program
	.version('0.0.2')
	.option('-c, --create', 'Create a password')
	.option('-C, --clean', 'Clean all passwords')
	.option('-n, --number', 'The length of your password you want, max is 32, default 12')
	.option('-f, --for', 'What is use for')
	.option('-s, --save', 'Save the password')
	.option('-l, --list', 'List all paswords')
	.parse(process.argv);

var passLog = {
	date : "",
	pass : "",
	usefor : ""
};

var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var dirPath = homeDir + "/.mypass";

var defsalt = "no one";

function decrypt(str) {
	var decipher = crypto.createDecipher('aes192', defsalt);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}

function encrypt(str) {
	var cipher = crypto.createCipher('aes192', defsalt);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
}

function hmacSha1(str) {
	var buf = crypto.randomBytes(32);
	var token1 = buf.toString('hex');

	var SecrectKey = token1;
	var Signture = crypto.createHmac('sha1', SecrectKey);
	Signture.update(str);
	var pass = Signture.digest().toString('base64');

	return pass;
}

function savePass(pass, usefor, cb) {
	var timeNow = moment().format('YYYY-MM-DD HH:mm:ss');
	usefor = usefor || 'default';

	passLog.date = timeNow;
	passLog.pass = pass;
	passLog.usefor = usefor;

	fs.writeFile(dirPath + "/pl", encrypt(JSON.stringify(passLog)) + "\n", {flag: "a"}, function(err){
		if(err){
			cb(err);
		} else {
			cb(null);
		}
	});
}

function checkPassExist(usefor, data) {
	var arr = data.split("\n");
	for(var i=0,len=arr.length; i<len; i++){
		if (arr[i]){
			var onePass = JSON.parse(arr[i]);
			if(onePass.usefor == usefor){
				return true;
			}
		}
	}

	return false;
}

function getPasswords (usefor, cb){
	usefor = usefor || 'default';

	fs.readFile(dirPath + "/pl", 'utf8', function(err, data){
		if(err){
			cb(err, null);
		} else {
			var arr = data.split("\n");
			var finalArr = [];
			for(var i=0,len=arr.length; i<len; i++){
				if (arr[i]){
					var onePass = JSON.parse(decrypt(arr[i]));
					if(onePass.usefor == usefor){
						finalArr.push(onePass);
					}

					console.log(
						chalk.green("usefor:") + chalk.cyan(onePass.usefor) + '\n'
						+ chalk.green("password:") +  chalk.blue.bgWhite.bold(onePass.pass) + '\n'
						+ chalk.green("time:") + chalk.yellow(onePass.date) + '\n'
					);
				}
			}
			cb(null, finalArr);
		}
	});
}

function create() {
	var humanInput = moment().format('X');

	var number = 12;

	if(program.number){
		number = program.args[0] || 12;
		if(!number.toString().match(/^[0-9]+$/)){
			return "error";
		}
	}

	return hmacSha1(humanInput).substr(0, number);
}

if(program.list){
	var usefor = '';
	if(program.for && !program.number){
		usefor = program.args[0];
	}

	getPasswords(usefor, function(err, data){
		if(err){
			return console.log(err.stack);
		}
	});
}

if(program.create){
	var pass = create();

	if(pass === "error"){
		return console.log(chalk.red("parameter 'number' error"));
	}
	return console.log(chalk.green.bold("Your password: ") + chalk.blue.bgWhite.bold(pass) );
}

if(program.save){
	var pass = create();

	if(pass === "error"){
		return console.log(chalk.red("parameter 'number' error"));
	}
	var usefor = null;
	if(program.for && program.number){
		usefor = program.args[1];
	} else if(program.for && !program.number){
		usefor = program.args[0];
	}

	fs.access(dirPath, function(err){
		if (err) {
			fs.mkdir(dirPath, function(err){
				if(err){
					return console.log(err.stack);
				}
			});
		}
		savePass(pass, usefor, function(err){
			if(err){
				return console.log(err.stack);
			} else {
				var message = chalk.green("Use for ") + chalk.cyan.bold(usefor|| 'default') + chalk.green(" create & save success")
					+ "\n" + chalk.yellow("run 'mypass -l [usefor]' to see the last password");
				return console.log(message);
			}
		});
	});
}

if(program.clean){
	fs.unlink(dirPath + "/pl", function(err){
		if(err){
			console.error(err);
		}
	});
}

'use strict';
var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment');
var path = require('path');

var passLog = {
	date : '',
	pass : '',
	usefor : ''
};

var homeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;

var dirPath = path.join(homeDir, '.mypass');

var defsalt = 'no one';

function decrypt (str) {
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

function md5(content) {
	let md5 = crypto.createHash('md5');
	md5.update(content);
	return md5.digest('hex');
}

exports.md5 = md5;

function hmacSha1(str) {
	var buf = crypto.randomBytes(32);
	var token1 = buf.toString('hex');

	var SecrectKey = token1;
	var Signture = crypto.createHmac('sha1', SecrectKey);
	Signture.update(str);
	var pass = Signture.digest().toString('base64');

	return pass;
}

function savePass(pass, usefor, userPass, cb) {
	let timeNow = moment().format('YYYY-MM-DD HH:mm:ss');
	usefor = usefor || 'default';
	let filePath = typeof userPass === 'undefined' ? '' : '-' + md5(userPass);
	passLog.date = timeNow;
	passLog.pass = pass;
	passLog.usefor = usefor;

	fs.writeFile(path.join(dirPath, 'pl' + filePath), encrypt(JSON.stringify(passLog)) + '\n', {flag: 'a'}, function(err) {
		if (err) {
			cb(err);
		} else cb(null, pass);
	});
}

function checkPassExist(usefor, data) {
	var arr = data.split('\n');
	for(var i=0, len=arr.length; i<len; i++) {
		if (arr[i]) {
			var onePass = JSON.parse(arr[i]);
			if (onePass.usefor == usefor) {
				return true;
			}
		}
	}

	return false;
}

function getPasswords (usefor, userPass, cb) {
	usefor = usefor || 'default';
	let filePath = typeof userPass === 'undefined' ? '' : '-' + md5(userPass);
	fs.readFile(path.join(dirPath, 'pl' + filePath), 'utf8', function(err, data) {
		if(err) {
			cb(err, null);
		} else {
			var arr = data.split('\n');
			var finalArr = [];
			for(var i=0, len=arr.length; i<len; i++) {
				if (arr[i]) {
					var onePass = JSON.parse(decrypt(arr[i]));
					if(usefor === 'default') {
						finalArr.push(onePass);
					} else {
						if(onePass.usefor == usefor) {
							finalArr.push(onePass);
							break;
						}
					}
				}
			}
			cb(null, finalArr);
		}
	});
}
function create(number) {
	var humanInput = moment().format('X');

	number = number || 12;

	return hmacSha1(humanInput).substr(0, number);
}

exports.creatPass = create;

exports.list = function (usefor, userPass, cb) {
	usefor = usefor || null;

	getPasswords(usefor, userPass, cb);
};

exports.init = function (userPass, cb) {
	if(typeof userPass === 'undefined') return cb(new Error('user password needed'));
	let filePath = '-' + md5(userPass);
	fs.access(dirPath, function(err) {
		if (err) {
			fs.mkdir(dirPath, function(e) {
				if(err) {
					cb(e);
				}
			});
		} else {
			fs.writeFile(path.join(dirPath, 'pl' + filePath), '', {flag: 'a'}, function(err) {
				if (err) {
					cb(err);
				} else cb(null);
			});
		}
	});
};

exports.genAndSave = function (usefor, userPass, cb) {
	var pass = create();

	if(pass === 'error') {
		cb(new Error('pass gen error 1'));
	}

	savePass(pass, usefor, userPass, cb);
};

exports.clean = function (userPass, cb) {
	let filePath = typeof userPass === 'undefined' ? '' : '-' + md5(userPass);
	fs.unlink(path.join(dirPath, 'pl' + filePath), cb);
};

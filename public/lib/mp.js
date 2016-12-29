'use strict';
var fs = require('fs');
var crypto = require('crypto');
var moment = require('moment');

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
			cb(null, pass);
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
					if(usefor === 'default'){
						finalArr.push(onePass);
					} else {
						if(onePass.usefor == usefor){
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

exports.list = function (usefor, cb) {
	usefor = usefor || null;

	getPasswords(usefor, cb);
};

exports.genAndSave = function (usefor, cb) {
	var pass = create();

	if(pass === "error"){
		cb(new Error('pass gen error 1'));
	}


	fs.access(dirPath, function(err){
		if (err) {
			fs.mkdir(dirPath, function(err){
				if(err){
					cb(err);
				}
			});
		}
		savePass(pass, usefor, cb);
	});
};

exports.clean = function (cb) {
	fs.unlink(dirPath + "/pl", cb);
};

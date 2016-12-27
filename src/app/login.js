'use strict';
var storage = window.localStorage;
const moment = require('moment');

var localPass = storage.getItem("mp-local-pass")!= null
	? JSON.parse(storage.getItem("mp-local-pass")) : null;

$("#btn-login-submit").click(function () {
	var email = $("#inputEmail").val(),
		password = $("#inputPassword").val(),
		obj = {
			email : email,
			password: password,
			expire: moment().add(30, 'days')
		}; // useless

	if(localPass === null){
		storage.setItem("mp-local-pass", JSON.stringify(obj));
	} else {
		console.log(moment().format(), localPass.expire);
		if(moment(localPass.expire).isAfter( moment().format()) == false){
			alert('expire login,please try again');
			return false;
		}
	}
	window.location.href = "main.js";
});
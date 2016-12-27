var storage = window.localStorage;
var localPass = storage.getItem("mp-local-pass")!= null
	? JSON.parse(storage.getItem("mp-local-pass")) : null;

const moment = require('moment');

$(document).ready(function () {
	if(checkLogin() == true){
		$("#btn-login-main").hide();
		$("#span-name-main").text(localPass.email).show();
	} else {
		$("#btn-login-main").show();
		$("#span-name-main").text("").hide();
	}
});

function checkLoginAndGoToList() {
	if(checkLogin() == false){
		window.location.href = "login.html";
	} else {
		window.location.href = "list.html";
	}
}

function checkLogin() {
	if(localPass === null){
		alert('Login first');

		return false;
	} else {
		if(!localPass.expire || moment(localPass.expire).isAfter( moment().format()) == false){
			alert('Error expire date');
			return false;
		}
	}
	return true;
}
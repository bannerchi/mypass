'use strict';
const moment = require('moment');
const core = require('../lib/mp');

var storage = window.localStorage;
var localPass = storage.getItem("mp-local-pass")!= null
	? JSON.parse(storage.getItem("mp-local-pass")) : null;

var $passwordForm = $("#password-add-form");
$(".nav-group-item").click(function () {
	var thisPane =  $(this).attr("pane");
	if(checkExpire() !== false) {
		$passwordForm.modal();
		return false;
	}
	$(this).siblings(".nav-group-item").each(function (index, elemnts) {
		$(elemnts).removeClass("active");
		var pane = $(elemnts).attr("pane");
		$("." + pane).hide();
	});

	$(this).addClass("active");
	$("." + thisPane).show();
	if(thisPane === "list-pane") {
		showList(null, localPass.password);
	}
});

$("#btn-add-pass").click(function () {
	let checkRes = checkExpire();
	let pass = $("#input-local-pass").val();
	if(checkRes === 'no login') {
		if (pass != null && pass !== '') {
			let obj = {
				password: core.md5(pass),
				expire: moment().add(10, 'minutes')
			};
			storage.setItem("mp-local-pass", JSON.stringify(obj));
		} else {
			alert("Error : empty password");
		}
	} else if(checkRes === "expire") {
		if(checkPass(pass) == true) {
			localPass.expire = moment().add(10, 'minutes');
			storage.setItem("mp-local-pass", JSON.stringify(localPass));
			$.modal.close();
		} else {
			alert("wrong password");
		}
	} else {
		if(checkPass(pass) === false) {
			alert("wrong password");
		} else {
			$.modal.close();
		}
	}
});

function checkPass(pass) {
	if(!localPass.password) {
		return false;
	}

	return localPass.password === core.md5(pass);
}

function checkExpire(init) {
	init = init || false;
	if(localPass === null) {
		init && alert('Enter local password for init');
		return 'no login';
	} else {
		if(!localPass.expire || moment(localPass.expire).isAfter(moment().format()) === false) {
			return 'expire';
		}
	}
	return false;
}

setInterval(function () {
	$("#strong-time-now").text(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
}, 1000);

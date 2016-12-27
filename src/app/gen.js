'use strict';
const core = require('../lib/mp');
var clipboard = nw.Clipboard.get();

$("#btn-gencode").click(function () {
	var userFor = $("#input-usefor").val();
	core.genAndSave(userFor, function (err, data) {
		if(err){
			alert(err.message);
		} else {
			$("#strong-password").text(data);
			$("#show-area").show();
		}
	})
});

$("#strong-password").click(function () {
	var value = $(this).text();
	var res = confirm("copy to clipboard");
	if(res == true){
		clipboard.set(value, 'text');
	}
});

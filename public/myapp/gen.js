'use strict';

$(function($) {
	$("#btn-gencode").click(function () {
		var userFor = $("#input-usefor").val();
		core.genAndSave(userFor, function (err, data) {
			if(err){
				alert(err.message);
			} else {
				$("#strong-password").text(data).show();
			}
		})
	});

	$("#strong-password").click(function () {
		var value = $(this).text();
		var res = confirm("copy to clipboard");
		if(res == true){
			clipboard.writeText(value);
		}
	});
});


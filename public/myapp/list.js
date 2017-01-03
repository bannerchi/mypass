'use strict';
const {clipboard} = require('electron');

function showList(kw, userPass) {
	kw = kw || null;
	core.list(kw, userPass, function (err, data) {
		if(err) {
			if(err.message.indexOf('file') !== -1) {
				alert('no password save, goto generate one');
			} else {
				alert(err.message);
			}
		} else {
			cleanHtml();
			var htmlTbody = '';
			data.length>0 && data.forEach(function (onePass, i) {
				htmlTbody += addHtml(onePass, i);
			});

			$("#table-body").append(htmlTbody);
			$(".list-passwords").click(function () {
				var value = $(this).text();
				var res = confirm("copy to clipboard");
				if(res === true) {
					clipboard.writeText(value);
				}
			});
		}
	});
}


function addHtml(onePass, i) {
	return "<tr>" +
		"<td>" + i + "</td>" +
		"<td>" + onePass.usefor + "</td>" +
		"<td><strong style='color: skyblue'><a href='#' class='list-passwords'>" +
		onePass.pass + "</a></strong></td>" +
		"<td>" + onePass.date + "</td>" +
		"</tr>";
}

function cleanHtml() {
	$("#table-body").children().remove();
}

$("#input-search").keydown(function(event) {
	var kw = $(this).val();
	switch(event.keyCode) {
		case 13:
			cleanHtml();
			showList(kw);
			$(this).val('');
			break;
	}
});


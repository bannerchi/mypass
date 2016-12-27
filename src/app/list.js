'use strict';
const core = require('../lib/mp'),
	  moment = require('moment');

var clipboard = nw.Clipboard.get();

showList();

function showList(kw) {
	kw = kw || null;
	core.list(kw, function (err, data) {
		if(err){
			alert(err.message);
		} else {
			var htmlTbody = '';
			data.length>0 && data.forEach(function (onePass, i) {
				htmlTbody += addHtml(onePass, i);
			});

			$("#table-body").append(htmlTbody);
			$(".list-passwords").click(function () {
				var value = $(this).text();
				var res = confirm("copy to clipboard");
				if(res == true){
					clipboard.set(value, 'text');
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

$("#input-search").keydown(function(event){
	var kw = $(this).val();
	switch(event.keyCode) {
		case 13:
			cleanHtml();
			showList(kw);
			break;
	}
});


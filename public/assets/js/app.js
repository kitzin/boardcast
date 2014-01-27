

$(function() {
	
	var menu = $("#menu");
	menu.find("#expand").click(function() {
		menu.animate({
			right: "0px"
		}, 1000);
	});
	
});
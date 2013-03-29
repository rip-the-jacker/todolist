$('form').submit(function(){
	var st = $('#text ').val()
	console.log(st)
	$('label').text(st)
})
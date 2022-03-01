Tail = require('tail').Tail;

var pomander = [
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
		[0,0,0],
	];
var accursed_hoard=[
		[0,0],
		[0,0],
		[0,0],
		[0,0],
	];
var traps=[
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
	];
var floor_effects=[
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
	];
var death_count=[0,0];
var floor=0;

var options = {
	fromBeginning:false,
	useWatchFile:true
}

tail = new Tail(process.argv[2], options);

function ParseString(str) {
	var split = str.split("|")
	if (split.length===6) {
		console.log(split[4])
	}
}

tail.on("line", function(data) {
  ParseString(data)
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
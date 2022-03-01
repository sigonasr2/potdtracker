Tail = require('tail').Tail;
const fs = require('fs');

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
var mimics=[0,0]
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
var accursed_hoard_detected=false

const POMANDER_NAMES = [
	"safety",
	"sight",
	"strength",
	"steel",
	"affluence",
	"flight",
	"alteration",
	"purity",
	"fortune",
	"witching",
	"serenity",
	"rage",
	"lust",
	"intuition",
	"raising",
	"resolution",]
	
const IMPEDING = 0
const TOADING = 1
const LANDMINE = 2
const LURING = 3
const ENFEEBLING = 4

var options = {
	fromBeginning:false,
	useWatchFile:true
}

var previous_pomander=""
var floor_storage={}
var update_file=false;

tail = new Tail(process.argv[2], options);

if (fs.existsSync('./data.json')) {
	var master_obj = JSON.parse(fs.readFileSync('./data.json','utf-8'))
	console.log("Loaded data from file...")
	console.log(master_obj)
	pomander=master_obj.pomander
	accursed_hoard=master_obj.accursed_hoard
	mimics=master_obj.mimics
	traps=master_obj.traps
	floor_effects=master_obj.floor_effects
	death_count=master_obj.death_count
	floor=master_obj.floor
	accursed_hoard_detected=master_obj.accursed_hoard_detected
	previous_pomander=master_obj.previous_pomander
	floor_storage=master_obj.floor_storage
}


function GetPomanderSlot(str) {
	for (var i=0;i<POMANDER_NAMES.length;i++) {
		if (POMANDER_NAMES[i]===str) {
			return i
		}
	}
	console.log("Could not find Pomander slot for pomander '"+str+"'! This should not be happening!")
	return -1
}

function ParseString(str) {
	var split = str.split("|")
	if (split.length===6) {
		//console.log(split[4])
		if (split[4].includes("The coffer...bares its fangs!")) {
			mimics[1]++
			update_file=true
		} else
		if (split[4].includes("You use a pomander of ")) {
			var pomander_name=split[4].substring("You use a pomander of ".length)
			pomander_name=pomander_name.substring(0,pomander_name.length-1)
			var pomander_slot = GetPomanderSlot(pomander_name)
			pomander[pomander_slot][0]-=1
			update_file=true
		} else
		if (split[4].includes("You cannot carry any more of that item.")) {
			var pomander_name=split[4].substring("You return the pomander of ".length)
			pomander_name=pomander_name.replace(" to the coffer. You cannot carry any more of that item.","")
			var pomander_slot = GetPomanderSlot(pomander_name)
			if (previous_pomander!==pomander_name) {
				if (floor_storage.hasOwnProperty(pomander_name)) {
					floor_storage[pomander_name]++
				} else {
					floor_storage[pomander_name]=1
				}
				previous_pomander=pomander_name
				pomander[pomander_slot][1]++
				pomander[pomander_slot][2]++
				mimics[0]++
			}
			update_file=true
		} else
		if (split[4].includes("Floor ")) {
			var fl=split[4].substring("Floor ".length)
			floor=Number(fl)
			previous_pomander=""
			floor_storage={}
			accursed_hoard_detected=false
			update_file=true
		} else
		if (split[4].includes("0) has begun.")) {
			var fl=split[4].substring("The Palace of the Dead (Floors ".length)
			fl=fl.substring(0,fl.indexOf("-"))
			floor=Number(fl)
			previous_pomander=""
			floor_storage={}
			accursed_hoard_detected=false
			update_file=true
		} else
		if (split[4].includes("0) has ended.")) {
			var fl=split[4].substring("The Palace of the Dead (Floors ".length)
			fl=fl.substring(0,fl.indexOf("-"))
			floor=0
			previous_pomander=""
			floor_storage={}
			accursed_hoard_detected=false
			for (var i=0;i<pomander.length;i++) {
				pomander[i][0]=0
			}
			for (var i=0;i<accursed_hoard.length;i++) {
				accursed_hoard[i][0]=0
			}
			for (var i=0;i<mimics.length;i++) {
				mimics[i]=0
			}
			for (var i=0;i<traps.length;i++) {
				traps[i][0]=0
			}
			for (var i=0;i<floor_effects.length;i++) {
				floor_effects[i][0]=0
			}
			death_count[1]++
			update_file=true
		} else
		if (split[4].includes("The enfeebling trap is triggered...")) {
			traps[ENFEEBLING][0]++
			traps[ENFEEBLING][1]++
			update_file=true
		} else
		if (split[4].includes("The toading trap is triggered...")) {
			traps[TOADING][0]++
			traps[TOADING][1]++
			update_file=true
		} else
		if (split[4].includes("The impeding trap is triggered...")) {
			traps[IMPEDING][0]++
			traps[IMPEDING][1]++
			update_file=true
		} else
		if (split[4].includes("The luring trap is triggered...")) {
			traps[LURING][0]++
			traps[LURING][1]++
			update_file=true
		} else
		if (split[4].includes("The landmine is triggered...")) {
			traps[LANDMINE][0]++
			traps[LANDMINE][1]++
			update_file=true
		} else
		if (split[4].includes("obtains a pomander of ")) {
			var pomander_name=split[4].substring(split[4].indexOf("obtains a pomander of ")+"obtains a pomander of ".length)
			pomander_name=pomander_name.substring(0,pomander_name.length-1)
			var pomander_slot = GetPomanderSlot(pomander_name)
			pomander[pomander_slot][0]++
			if (floor_storage.hasOwnProperty(pomander_name)&&floor_storage[pomander_name]>0) {
				floor_storage[pomander_name]--
			} else {
				pomander[pomander_slot][1]++
				pomander[pomander_slot][2]++
				mimics[0]++
			}
			update_file=true
		} else
		if (split[4].includes("You sense the Accursed Hoard calling you...")) {
			accursed_hoard_detected=true
			update_file=true
		} else
		if (split[4].includes("You discover a piece of the Accursed Hoard!")) {
			accursed_hoard_detected=false
			if (floor<=50) {
				accursed_hoard[0][0]++
				accursed_hoard[0][1]++
			} else
			if (floor<=100) {
				accursed_hoard[1][0]++
				accursed_hoard[1][1]++
			} else
			if (floor<=150) {
				accursed_hoard[2][0]++
				accursed_hoard[2][1]++
			} else {
				accursed_hoard[3][0]++
				accursed_hoard[3][1]++
			}
			update_file=true
		} else
		if (split[4].includes("You are revived!")) {
			death_count[0]++
			death_count[1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment stimulates your humours, increasing the speed with which you act.")) {
			floor_effects[0][0]++
			floor_effects[0][1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment revitalizes your body and mind.")) {
			floor_effects[1][0]++
			floor_effects[1][1]++
			update_file=true
		} else
		if (split[4].includes("The gathering gloom appears to invigorate the floor's denizens.")) {
			floor_effects[2][0]++
			floor_effects[2][1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment clouds your eyes, making it difficult to discern your quarry.")) {
			floor_effects[3][0]++
			floor_effects[3][1]++
			update_file=true
		} else
		if (split[4].includes("The items in your bag have temporarily transformed into worthless stone.")) {
			floor_effects[4][0]++
			floor_effects[4][1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment clouds your mind, making it impossible to remember previously learned abilities.")) {
			floor_effects[5][0]++
			floor_effects[5][1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment saps your health.")) {
			floor_effects[6][0]++
			floor_effects[6][1]++
			update_file=true
		} else
		if (split[4].includes("An ancient enchantment saps your very strength, weakening your blows.")) {
			floor_effects[7][0]++
			floor_effects[7][1]++
			update_file=true
		} else
		if (split[4].includes("Your body is fatigued and wounds refuse to heal on their own.")) {
			floor_effects[8][0]++
			floor_effects[8][1]++
			update_file=true
		} else
		if (split[4].includes("Your entire body feels heavy.")) {
			floor_effects[9][0]++
			floor_effects[9][1]++
			update_file=true
		} else
		if (split[4].includes("You find yourself short of breath, unable to sprint.")) {
			floor_effects[10][0]++
			floor_effects[10][1]++
			update_file=true
		}
		
		if (update_file) {
			update_file=false
			var master_obj = {
				pomander:pomander,
				accursed_hoard:accursed_hoard,
				mimics:mimics,
				traps:traps,
				floor_effects:floor_effects,
				death_count:death_count,
				floor:floor,
				accursed_hoard_detected:accursed_hoard_detected,
				previous_pomander:previous_pomander,
				floor_storage:floor_storage,
			}
			fs.writeFileSync('./data.json', JSON.stringify(master_obj, null, 2) , 'utf-8');
		}
	}
}

tail.on("line", function(data) {
  ParseString(data)
});

tail.on("error", function(error) {
  console.log('ERROR: ', error);
});
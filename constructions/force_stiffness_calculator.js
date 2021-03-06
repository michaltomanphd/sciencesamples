
/*
Formula:

m g S
--------
K ||sum Si||
*/


fs = require('fs');

CMD_ASSERTLOAD = "ASSERTLOAD"
CMD_DEFINEBEAM = "DEFINEBEAM"

COMMANDS = [CMD_ASSERTLOAD, CMD_DEFINEBEAM]

var KS = 0;

var cfgFileName = process.argv[2]
var lines = fs.readFileSync(cfgFileName).toString().split("\n");

// process the content
for(i in lines) {
	var line = lines[i].trim();
	if (line.length > 0 && !line.startsWith("#")) {
	
		// process a next line
		indexOfFirstSpace = line.indexOf(" ");
		if (indexOfFirstSpace > -1) {
			command = line.substring(0, indexOfFirstSpace).toUpperCase();
			options = line.substring(indexOfFirstSpace+1);
		} 
		else {
			command = line.toUpperCase();
			options = undefined;
		}
		options = JSON.parse(options);
		
		// perform a command
		switch (command) {
		
			// define a beam
			case CMD_DEFINEBEAM:
	
				if (options.cylinder !== undefined) {
					KS += 3.14 * options.cylinder.r * options.cylinder.r * options.material.K;
				}			
				else if (options.block !== undefined) {
					KS += options.block.w * options.block.d * options.material.K;
				}
				else {
					console.log("Unknown shape of a beam");
				}
 
				break;
				
			// assert load
			case CMD_ASSERTLOAD:

				var result = options.load * 9.81 * options.surface * Math.cos(options.angle * (Math.PI / 180)) / KS;
				console.log("Result: " + result);
				if (result < 1) {
					console.log("OK");
				}
				 else {
				 	console.log("NOT OK");
				 }
				
				break;
				
			// invalid command
			default:
				console.log("Invalid command");
		}
	}
	
}

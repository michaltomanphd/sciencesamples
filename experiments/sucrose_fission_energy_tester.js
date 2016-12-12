
/*

Formula:

Fe = Q1Q2 / 4 Pi e * r * r
d = sqrt( (x1-y1) * (x1-y1) + (x2-y2) * (x2-y2) + (x3-y3) * (x3-y3) )

Ei = sum Wi, where Wi = Fi * di

Eo > Ei ---> break

*/

fs = require('fs');

CMD_ASSERTENERGY = "ASSERTENERGY"
CMD_DEFINECHARGE = "DEFINECHARGE"

COMMANDS = [CMD_ASSERTENERGY, CMD_DEFINECHARGE]

var arrayOfCharges = [];

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
		
			// define a charge
			case CMD_DEFINECHARGE:
				arrayOfCharges.push(options);
				break;
				
			// assert energy
			case CMD_ASSERTENERGY:
				var resultE = 0;
				var cp = options.permittivity;
				if (arrayOfCharges.length > 1) {
					for (var j=0;j<arrayOfCharges.length-1;j++) {
						var charge1 = arrayOfCharges[j];
						var point1 = charge1.point;
						for (var k = j + 1;k<arrayOfCharges.length;k++) {
							var charge2 = arrayOfCharges[k];
							var point2 = charge2.point;
							di = Math.sqrt (  (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y) + (point1.z - point2.z) * (point1.z - point2.z) );
							Fi = charge1.value * charge2.value / 4 * 3.14 * cp * di * di;
							Wi = Fi * di;
							console.log("" + di + "_" + Fi);
							resultE += Wi;
						}
					}
					
					console.log("ResultE: " + resultE);
					eOut = options.value;
					console.log("OutsideE: " + eOut);
					if (resultE > eOut) {
						console.log("OK");
					}
					 else {
					 	console.log("NOT OK");
					 }
				}
				 else {
				 	console.log("Define at least 2 charges");
				 }
				
				break;
				
			// invalid command
			default:
				console.log("Invalid command");
		}
	}
	
}

/**
 * A blackbox recorder for my quad
 *
 * @property {number} simCardSize - Number of entries and raw data logs allowed
 * @property {Array} entries - Array of text entries in the log
 * @property {Object[]} dataLog - Array of data objects { desiredAngle: gyroAngle }
 */
class Blackbox {
	/**
	 * Create a new blackbox 
	 */
	constructor() {
		this.simCardSize = 100;
		this.entries = [];
		this.dataLog = [];
	}
	/**
	 * Log an entry in the blackbox
	 *
	 * @param {string} entry - The text to put in the blackbox
	 */
	log(entry) {
		
		this.entries.push(entry);
		
		/* Clean up if we've filled the sim card */
		if(this.entries.length > this.simCardSize-1) {
			this.entries.splice(0,1);
		}
	}
	/**
	 * Log raw data { desiredAngle: gyroAngle }
	 *
	 * @param {number} desiredAngle - The angle we want to be at
	 * @param {number} gyroAngle - The angle the gyro is reporting
	 */
	logData(desiredAngle, gyroAngle) {
	
		this.dataLog.push( { desiredAngle: desiredAngle, gyroAngle: gyroAngle } );
		
		/* Clean up if we've filled the sim card */
		if(this.dataLog.length > this.simCardSize-1) {
			this.dataLog.splice(0,1);
		}
	}
}
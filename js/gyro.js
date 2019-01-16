/**
 * The gyro in the quadcopter, just reports back the current angle
 * 
 * @author Matthew Page <work@mjp.co>
 */
 class Gyro {
 	/* 
	 * Make a new gyro
	 *
	 * @param {Blackbox} blackbox - The blackbox for recording data
	 */
 	constructor(blackbox) {
		
		this.blackbox = blackbox;
		
		/* Angle the quad is at */
		this.angle = 0;
		
		this.blackbox.log(`Gyro - calibrated to ${this.angle}`);
	}
}
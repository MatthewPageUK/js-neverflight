/**
 * A simple PID controller. This tries to correct an error / difference between
 * the desired angle and the actual angle of the quad.
 * 100 25 130 = nice tune :)
 *
 * @property {number} blackbox - The blackbox for recording data
 * @property {number} p - Proportional to the error
 * @property {number} i - Integral (increase over time)
 * @property {number} d - Derivitive (look into the future)
 * @property {number} pTune - Adjustment weight
 * @property {number} iTune - Adjustment weight
 * @property {number} dTune - Adjustment weight
 * @property {number} error - The error amount we are trying to fix
 * @property {number} previousError - The previous error amount (used to calc d)
 * @property {number} dt - How many times we've tried to fix this error
 * @author Matthew Page <work@mjp.co>
 */
class PID {
	/**
	 * Make a new PID controller
	 *
	 * @param {Blackbox} blackbox - The blackbox for recording data
	 */
	constructor(blackbox) {
		
		this.blackbox = blackbox;
		this.p = 0;
		this.i = 0;
		this.d = 0;
		this.pTune = 0.01;
		this.iTune = 0.01;
		this.dTune = 0.01;	
		this.error = 0;
		this.previousError = 0;
		this.dt = 1;
		
		this.blackbox.log(`PID - Controller ready`);
	}	
	/**
	 * Reset the PID controller, we do this when we have corrected the error, or we have
	 * overshot past it and we are dealing the new overshoot error
	 */
	reset() {
		this.p = 0;
		this.i = 0;
		this.d = 0;
		this.dt = 1;
		this.error = 0;
		this.previousError = 0;
		this.blackbox.log(`PID - Controller reset`);
	}
	/**
	 * Calculate the PID values based on the supplied error 
	 * Returns the output value that is used to apply the correction. It is a measure of 
	 * how much correction to apply. A big error usually produces a big correction, as the
	 * error reduces the correction decreases as well.
	 *
	 * @param {number} error - The error value (current angle - desired angle)
	 * @returns {number} - The correction value
	 */
	calculateErrorCorrection(error) {

		this.blackbox.log(`PID - Fixing error ${parseFloat(error).toFixed(3)}`);

		let correction = 0;
				
		/* Error from the FC (current angle - desired angle) */
		this.error = error;
		
		if(this.error == 0) {
			
			this.blackbox.log(`PID - Error is zero`);
			/* No error, we are done, woohoo */
			this.reset();
			return 0;
		
		} else {
		
			/* P = the error reported (proportion here is 2 to 1) */
			this.p = this.error/2;
			
			/* I = I + the error * the number of times we've tried to fix it */
			this.i = this.i + this.error * this.dt;
			
			/* D = This error - previous error (difference in error) / times we've tried to fix it */
			this.d = (this.error - this.previousError) / this.dt;
			
			this.blackbox.log(`PID - Calculated P ${parseFloat(this.p).toFixed(2)}, I ${parseFloat(this.i).toFixed(2)}, D ${parseFloat(this.d).toFixed(2)}, dt ${this.dt}`);
			
			/* Output I + P + D with their relevant tunes / weights applied */
			correction = ( this.pTune * this.p ) + ( this.iTune * this.i ) + ( this.dTune * this.d );
			
			this.blackbox.log(`PID - Correction value ${parseFloat(correction).toFixed(3)}`);
			
			/* Remember this error for the next loop */
			this.previousError = this.error;
			
			/* Increase the counter until we know we have fixed the error */
			this.dt += 1;
			
			/* Returnt the correction value */
			return correction;
		}
	}
}
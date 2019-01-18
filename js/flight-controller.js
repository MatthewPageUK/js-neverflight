/**
 * Reads the gyro, accepts commands from the controller, runs the PID loop and 
 * applies the correction needed. Stable and steady flying :)
 *
 * @property {Gyro} gyro - The gyroscope object, just the angle value
 * @property {PID} pid - The PID controller
 * @property {number} loops - The number of loops the FC has done
 * @property {number} desiredAngle - The angle requested by the pilot
 * @property {number} lastError - The last error we had
 * @property {string} lastErrorDirection - The direction the last error was in cw | ccw
 * @property {number} error - The current error we have now
 * @property {string} errorDirection - The direction the current error is in cw | ccw
 */
class FlightController {
	/**
	 * Make a new flight controller, no soldering needed 
	 *
	 * @param {Gyro} gyro - The gyroscope object, just the angle value
	 * @param {PID} pid - The PID controller
	 */
	constructor(gyro, pid, blackbox) {
		this.blackbox = blackbox;
		this.blackbox.log(`FC - ItWillNeverFlight 0.1 Starting`);
		this.gyro = gyro;
		this.pid = pid;
		this.desiredAngle = 0;
		this.error = 0;
		this.errorDirection = "cw";
		this.blackbox = blackbox;
		this.blackbox.log(`FC - Running, ready to receive commands`);
	}
	/**
	 * Receive a command from the controller - go to angle 'a'
	 *
	 * @param {number} a - The angle we want the quad to be at
	 */
	receiveCommand(a) {
		this.blackbox.log(`FC - Received PWM command (${a})`);
		
		/* Set the angle */
		this.desiredAngle = a;
						  
		/* Reset the PID controller so it's ready to deal with this on the next loop */
		this.blackbox.log(`FC - Resetting the PID controller`);
		this.pid.reset();
	}
	/**
	 * Do a single PID loop to get the correction value and apply it
	 *
	 */
	doPIDLoop() {
		
		this.blackbox.log(`FC - Doing PID loop`);

		/* Direction of the error, helpful to check if we go past the desired angle */
		this.errorDirection = (this.gyro.angle > this.desiredAngle) ? "ccw" : "cw";
		
		/* The error, difference between the current gyro angle and the desired angle */
		this.error = Math.abs(this.gyro.angle - this.desiredAngle);

		if(this.error > 0) {
			
			this.blackbox.log(`FC - Found error ${this.error}`);
		
			/* Get the correction amount from the PID controller */
			let correctionAmount = this.pid.calculateErrorCorrection(this.error);

			/* Tell the quad to execute the move */
			this.moveQuad(correctionAmount);

			/* Have we gone past the desired angle - reset the PID controller to deal with this new error next time */
			if(this.errorDirection == "cw") {
				if(this.gyro.angle > this.desiredAngle) {
					this.blackbox.log(`FC - OVERSHOT! desired angle, bounce back coming`);
					this.pid.reset();
				}
			} else {
				if(this.gyro.angle < this.desiredAngle) {
					this.blackbox.log(`FC - OVERSHOT! desired angle, bounce back coming`);
					this.pid.reset();
				}	
			}
			
			/* Have we reached the desired angle - reset the PID controller */
			if(this.currentAngle == this.desiredAngle) {
				this.blackbox.log(`FC - Error has been fixed`);
				this.pid.reset();
			}
			
		} else {
			this.blackbox.log(`FC - No error to fix`);	
			this.moveQuad(0);
		}
	}
	/**
	 * Simulate the movement of the quad. This would involve changing motor speeds and all
	 * sorts of complicated stuff. Here we just change the angle.
	 *
	 * @param {number} c - The correction amount from the PID controller
	 */
	moveQuad(c) {
		this.blackbox.log(`FC - Moving the quad by ${parseFloat(c).toFixed(2)}`);
		
		/* We only apply correction/2 , makes things look nicer on screen */
		let a = this.gyro.angle + ( (this.errorDirection=="ccw") ? -c/2 : c/2 );
		this.gyro.angle = Number(parseFloat(a).toFixed(2));
		
		// WIND - just keep adding 5 to the angle, annoys the hell out of the PID loop
		if(wind.checked) this.gyro.angle += 5;
		
		this.blackbox.logData(this.desiredAngle, this.gyro.angle);
	}
	
	
	
	rotateQuad(direction, amount) {
	
		/*
			v = 123;
			this.motor1.receiveVoltageInput( v );
			
			angle += this.motor1.thrust
		
		*/
		
	}
}
			
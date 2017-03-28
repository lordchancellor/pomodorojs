require('../sass/style.scss');

const setupAPI = {
	setDate: function setDate() {
		document.getElementsByClassName('currentYear')[0].textContent = new Date().getFullYear();
	},

	setListeners: function setListeners() {
		const startBtn = document.getElementsByClassName('start-btn')[0];
		const pauseBtn = document.getElementsByClassName('pause-btn')[0];
		const resetBtn = document.getElementsByClassName('reset-btn')[0];
		const increaseWorkTime = document.getElementsByClassName('work-time')[0].getElementsByClassName('increase')[0];
		const decreaseWorkTime = document.getElementsByClassName('work-time')[0].getElementsByClassName('decrease')[0];
		const increaseBreakTime = document.getElementsByClassName('break-time')[0].getElementsByClassName('increase')[0];
		const decreaseBreakTime = document.getElementsByClassName('break-time')[0].getElementsByClassName('decrease')[0];

		startBtn.addEventListener('click', () => timerAPI.startTimer());
		pauseBtn.addEventListener('click', () => timerAPI.pauseTimer());
		resetBtn.addEventListener('click', () => uiAPI.reset());
		increaseWorkTime.addEventListener('click', () => uiAPI.increaseWorkTime());
		decreaseWorkTime.addEventListener('click', () => uiAPI.decreaseWorkTime());
		increaseBreakTime.addEventListener('click', () => uiAPI.increaseBreakTime());
		decreaseBreakTime.addEventListener('click', () => uiAPI.decreaseBreakTime());
	},

	setupPage: function setupPage() {
		this.setDate();
		this.setListeners();
		uiAPI.setTimers();
	}
};

const uiAPI = {
	setTimers: function setTimers() {
		const workTime = this.getMinutes('work-time');
		const breakTime = this.getMinutes('break-time');

		workTime.textContent = timerAPI.getWorkTime() < 10 ? '0' + timerAPI.getWorkTime() : timerAPI.getWorkTime();
		breakTime.textContent = timerAPI.getBreakTime() < 10 ? '0' + timerAPI.getBreakTime() : timerAPI.getBreakTime();
	},

	getMinutes: function getMinutes(parent) {
		return document.getElementsByClassName(parent)[0].getElementsByClassName('minutes')[0];
	},

	getSeconds: function getSeconds(parent) {
		return document.getElementsByClassName(parent)[0].getElementsByClassName('seconds')[0];
	},

	reset: function reset() {
		const workMinutes = this.getMinutes('work-time');
		const breakMinutes = this.getMinutes('break-time');
		const seconds = document.getElementsByClassName('seconds');

		workMinutes.textContent = timerAPI.getWorkTime();
		breakMinutes.textContent = timerAPI.getBreakTime();

		for (const section of seconds) {
			section.textContent = '00';
		}
	},

	resetIndividual: function resetIndividual(isWorkTime) {
		if (isWorkTime) {
			const breakTime = document.getElementsByClassName('break-time')[0].getElementsByClassName('minutes')[0];
			
			breakTime.textContent = timerAPI.getBreakTime() < 10 ? '0' + timerAPI.getBreakTime() : timerAPI.getBreakTime();
		}
		else {
			const workTime = document.getElementsByClassName('work-time')[0].getElementsByClassName('minutes')[0];

			workTime.textContent = timerAPI.getWorkTime() < 10 ? '0' + timerAPI.getWorkTime() : timerAPI.getWorkTime;
		}
	},

	resetSeconds: function resetSeconds(parent) {
		document.getElementsByClassName(parent)[0].getElementsByClassName('seconds')[0].textContent = '00';
	},

	increaseWorkTime: function increaseWorkTime() {
		const element = this.getMinutes('work-time');
		const minutes = timerAPI.getWorkTime() < 99 ? timerAPI.getWorkTime() + 1 : 1;

		element.textContent = Number(minutes) < 10 ? this.appendZero(minutes) : minutes;
		this.resetSeconds('work-time');
		timerAPI.setWorkTime(minutes);
	},

	decreaseWorkTime: function decreaseWorkTime() {
		const element = this.getMinutes('work-time');
		const minutes = timerAPI.getWorkTime() > 1 ? timerAPI.getWorkTime() - 1 : 99;

		element.textContent = Number(minutes) < 10 ? this.appendZero(minutes) : minutes;
		this.resetSeconds('work-time');
		timerAPI.setWorkTime(minutes);
	},

	increaseBreakTime: function increaseBreakTime() {
		const element = this.getMinutes('break-time');
		const minutes = timerAPI.getBreakTime() < 99 ? timerAPI.getBreakTime() + 1 : 1;

		element.textContent = Number(minutes) < 10 ? this.appendZero(minutes) : minutes;
		this.resetSeconds('break-time');
		timerAPI.setBreakTime(minutes);
	},

	decreaseBreakTime: function decreaseBreakTime() {
		const element = this.getMinutes('break-time');
		const minutes = timerAPI.getBreakTime() > 1 ? timerAPI.getBreakTime() - 1 : 99;

		element.textContent = Number(minutes) < 10 ? this.appendZero(minutes) : minutes;
		this.resetSeconds('break-time');
		timerAPI.setBreakTime(minutes);
	},

	toggleButtons: function toggleButtons(isPaused) {
		console.log('Toggle buttons called with isPaused = ' + isPaused);

		const buttons = [
			document.getElementsByClassName('reset-btn')[0],
			document.getElementsByClassName('work-time')[0].getElementsByClassName('increase')[0],
			document.getElementsByClassName('work-time')[0].getElementsByClassName('decrease')[0],
			document.getElementsByClassName('break-time')[0].getElementsByClassName('increase')[0],
			document.getElementsByClassName('break-time')[0].getElementsByClassName('decrease')[0]
		];
		
		for (const button of buttons) {
			if (!isPaused) {
				button.setAttribute('disabled', 'disabled');
			}
			else {
				button.removeAttribute('disabled');
			}
		}
	},

	appendZero: function appendZero(number) {
		return '0' + number;
	}
};

const timerAPI = {
	workTime: 1,
	breakTime: 1,
	isPaused: false,
	isWorkTime: true,
	timeouts: [],

	getWorkTime: function getWorkTime() {
		return this.workTime;
	},

	setWorkTime: function setWorkTime(time) {
		this.workTime = time;
	},

	getBreakTime: function getBreakTime() {
		return this.breakTime;
	},

	setBreakTime: function setBreakTime(time) {
		this.breakTime = time;
	},

	startTimer: function startTimer() {
		document.getElementsByClassName('start-button-container')[0].style.display = 'none';
		document.getElementsByClassName('pause-button-container')[0].style.display = 'flex';

		if (!this.isPaused) {
			uiAPI.toggleButtons(this.isPaused);
			this.countDown(this.workTime);
		}
		else {
			const minutes = this.isWorkTime ? Number(uiAPI.getMinutes('work-time').textContent) : Number(uiAPI.getMinutes('break-time').textContent);
			const seconds = this.isWorkTime ? Number(uiAPI.getSeconds('work-time').textContent) : Number(uiAPI.getSeconds('break-time').textContent);

			this.isPaused = false;
			uiAPI.toggleButtons(this.isPaused);

			if (seconds !== 0) {
				this.countDown(minutes + 1, seconds-1);
			}
			else if (minutes !== 0) {
				this.countDown(minutes);
			}
			else {
				this.nextCycle();
			}
		}
	},

	pauseTimer: function pauseTimer() {
		document.getElementsByClassName('start-button-container')[0].style.display = 'flex';
		document.getElementsByClassName('pause-button-container')[0].style.display = 'none';

		this.isPaused = true;
		this.clearTimeouts();
		uiAPI.toggleButtons(this.isPaused);
	},

	nextCycle: function nextCycle() {
		this.isWorkTime = !this.isWorkTime;
		this.clearTimeouts();
		uiAPI.resetIndividual(this.isWorkTime);
		this.countDown();
	},

	countDown: function countDown(time = timerAPI.isWorkTime ? timerAPI.workTime : timerAPI.breakTime, seconds = 59) {
		if (!timerAPI.isPaused) {
			if (time === 0) {
				timerAPI.nextCycle();
			}
			else {
				const minutes = timerAPI.isWorkTime ? uiAPI.getMinutes('work-time') : uiAPI.getMinutes('break-time');

				// Make sure nobody tries to kick off a timer with more than 59 seconds
				seconds = seconds > 59 ? 59 : seconds;

				if (seconds === 59 && time < 10) {
					minutes.textContent = time > 0 ? uiAPI.appendZero(time - 1) : uiAPI.appendZero(time);
				}
				else if (seconds === 59 && time >= 10) {
					minutes.textContent = time > 0 ? time - 1 : time;
				}

				timerAPI.minuteTimer(seconds);
				timerAPI.timeouts.push(setTimeout(() => timerAPI.countDown(time - 1), (seconds + 1) * 1000));
			}
		}
	},

	minuteTimer: function minuteTimer(i = 59) {
		const seconds = timerAPI.isWorkTime ? uiAPI.getSeconds('work-time') : uiAPI.getSeconds('break-time');

		if (i >= 0 && !timerAPI.isPaused) {
			if (i < 10) {
				seconds.textContent = '0' + i;
			}
			else {
				seconds.textContent = i;
			}
			timerAPI.timeouts.push(setTimeout(() => timerAPI.minuteTimer(i-1), 1000));
		}
	},

	clearTimeouts: function clearTimeouts() {
		for (const timeout of timerAPI.timeouts) {
			clearTimeout(timeout);
		}
	}
};

// TODO Remove for production
window.timer = timerAPI;

(() => setupAPI.setupPage())();
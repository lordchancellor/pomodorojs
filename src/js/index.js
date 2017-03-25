require('../sass/style.scss');

const setupAPI = {
	setDate: function setDate() {
		document.getElementsByClassName('currentYear')[0].textContent = new Date().getFullYear();
	},

	setListeners: function setListeners() {
		const startBtn = document.getElementsByClassName('start-btn')[0];
		const pauseBtn = document.getElementsByClassName('pause-btn')[0];
		const resetBtn = document.getElementsByClassName('reset-btn')[0];

		startBtn.addEventListener('click', () => timerAPI.startTimer());
		pauseBtn.addEventListener('click', () => timerAPI.pauseTimer());
		resetBtn.addEventListener('click', () => uiAPI.reset());
	},

	setupPage: function setupPage() {
		this.setDate();
		this.setListeners();
		uiAPI.setTimers();
	}
};

const uiAPI = {
	setTimers: function setTimers() {
		document.getElementsByClassName('work-time')[0].getElementsByClassName('minutes')[0].textContent = timerAPI.getWorkTime();
		document.getElementsByClassName('break-time')[0].getElementsByClassName('minutes')[0].textContent = timerAPI.getBreakTime();
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
	}
};

const timerAPI = {
	workTime: 1,
	breakTime: 1,
	isPaused: false,
	isWorkTime: true,

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
			this.countDown(this.workTime);
		}
		else {
			console.log('Paused code');
			let minutes;
			let seconds;

			if (this.isWorkTime) {
				minutes = Number(uiAPI.getMinutes('work-time').textContent);
				seconds = Number(uiAPI.getSeconds('work-time').textContent);
			}
			else {
				minutes = Number(uiAPI.getMinutes('work-time').textContent);
				seconds = Number(uiAPI.getSeconds('work-time').textContent);
			}

			this.isPaused = false;

			if (seconds !== 0) {
				this.countDown(minutes, seconds-1);
			}
			else if (minutes !== 0) {
				this.countDown(minutes-1);
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
	},

	nextCycle: function nextCycle() {
		this.isWorkTime = !this.isWorkTime;
		this.countDown();
	},

	countDown: function countDown(time = this.isWorkTime ? this.workTime : this.breakTime, seconds = 59) {
		const minutes = timerAPI.isWorkTime ? uiAPI.getMinutes('work-time') : uiAPI.getMinutes('break-time');

		if (time > 0 && !timerAPI.isPaused) {
			minutes.textContent = Number(time - 1);
			timerAPI.minuteTimer(seconds);
			setTimeout(() => timerAPI.countDown(time - 1), 60000);
		}

		if (time === 0) {
			this.nextCycle();
			console.log('End of cycle');
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
			setTimeout(() => timerAPI.minuteTimer(i-1), 1000);
		}
	}
};

// TODO Remove for production
window.timer = timerAPI;

(() => setupAPI.setupPage())();
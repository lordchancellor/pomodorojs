require('../sass/style.scss');

const setupAPI = {
	setDate: function setDate() {
		document.getElementsByClassName('currentYear')[0].textContent = new Date().getFullYear();
	},

	setListeners: function setListeners() {
		const startBtn = document.getElementsByClassName('start-btn')[0];
		const resetBtn = document.getElementsByClassName('reset-btn')[0];

		startBtn.addEventListener('click', () => timerAPI.startTimer());
		resetBtn.addEventListener('click', () => uiAPI.reset());
	},

	setupPage: function setupPage() {
		this.setDate();
		this.setListeners();
	}
};

const uiAPI = {
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

		for (section of seconds) {
			section.textContent = '00';
		}
	}
};

const timerAPI = {
	workTime: 1,
	breakTime: 5,
	timerActive: false,

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
		const label = document.getElementsByClassName('start-pause')[0];

		if (!this.timerActive) {
			label.textContent = 'Pause';
			this.countDown(this.workTime);
		}
		else {
			label.textContent = 'Start';
			this.timerActive = false;
		}
	},

	countDown: function countDown(time = this.workTime) {
		this.timerActive = true;
		const minutes = uiAPI.getMinutes('work-time');

		if (time >= 0) {
			minutes.textContent = time;
			this.minuteTimer();
			setTimeout(() => this.countDown(time - 1), 60000);
		}
	},

	minuteTimer: function minuteTimer(i = 59) {
		const seconds = uiAPI.getSeconds('work-time');

		if (i >= 0) {
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

window.timer = timerAPI;

(() => setupAPI.setupPage())();
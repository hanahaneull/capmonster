const fetch = require('node-fetch');

class capmonster {
	constructor(clientKey = '', recognizingThreshold = 0) {
		this.clientKey = clientKey;
		this.recognizingThreshold = recognizingThreshold;
	}

	async getBalance() {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		const response = await fetch('https://api.capmonster.cloud/getBalance', {
			method: 'POST',
			body: JSON.stringify({
				clientkey: this.clientKey,
			}),
		});
		const json = await response.json();

		return json;
	}

	async createTask(task = {}, softId = 0, callbackUrl = '') {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		const response = await fetch('https://api.capmonster.cloud/createTask', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				task: task,
				softId: softId,
				callbackUrl: callbackUrl,
			}),
		});
		const json = await response.json();

		return json;
	}

	async solveReCaptchaV2(websiteURL = '', websiteKey = '') {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		const response = await fetch('https://api.capmonster.cloud/createTask', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				task: {
					type: 'NoCaptchaTaskProxyless',
					websiteURL: websiteURL,
					websiteKey: websiteKey,
				},
			}),
		});
		const json = await response.json();

		return json;
	}

	async solveImageCaptcha(base64 = '') {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		const response = await fetch('https://api.capmonster.cloud/createTask', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				task: {
					recognizingThreshold: this.recognizingThreshold,
					type: 'ImageToTextTask',
					body: base64,
				},
			}),
		});
		const json = await response.json();

		return json;
	}

	async decodeReCaptchaV2(websiteURL = '', websiteKey = '') {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		let solved = false;
		const response = await fetch('https://api.capmonster.cloud/createTask', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				task: {
					type: 'NoCaptchaTaskProxyless',
					websiteURL: websiteURL,
					websiteKey: websiteKey,
				},
			}),
		});
		const json = await response.json();

		while (!solved) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const result = await this.getResult(json.taskId);
			if (result.status == 'ready') {
				solved = true;
				return result;
			}
		}
	}

	async decodeImageCaptcha(base64 = '') {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		let solved = false;
		const response = await fetch('https://api.capmonster.cloud/createTask', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				task: {
					recognizingThreshold: this.recognizingThreshold,
					type: 'ImageToTextTask',
					body: base64,
				},
			}),
		});
		const json = await response.json();

		while (!solved) {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const result = await this.getResult(json.taskId);
			if (result.status == 'ready') {
				solved = true;
				return result;
			}
		}
	}

	async getResult(taskId = 0) {
		if (typeof this.clientKey !== 'string' || !this.clientKey.length)
			throw new Error('No clientKey provided or clientKey not String');
		const response = await fetch('https://api.capmonster.cloud/getTaskResult', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				taskId: taskId,
			}),
		});
		const json = await response.json();

		return json;
	}
}

module.exports = capmonster;

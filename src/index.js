const fetch = require('node-fetch');

class capmonster {
	constructor(clientKey = String, recognizingThreshold = 0) {
		this.clientKey = clientKey;
		this.recognizingThreshold = recognizingThreshold;
	}

	async getBalance() {
		const response = await fetch('https://api.capmonster.cloud/getBalance', {
			method: 'POST',
			body: JSON.stringify({
				clientkey: this.clientKey,
			}),
		});
		const json = await response.json();

		return json;
	}

	async createTask(task = {}, softId = 0, callbackUrl = null) {
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

	async solveReCaptchaV2(websiteURL, websiteKey) {
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

	async solveImageCaptcha(base64) {
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

	async decodeReCaptchaV2(websiteURL, websiteKey) {
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

	async decodeImageCaptcha(base64) {
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

	async getResult(taskid = 0) {
		const response = await fetch('https://api.capmonster.cloud/getTaskResult', {
			method: 'POST',
			body: JSON.stringify({
				clientKey: this.clientKey,
				taskId: taskid,
			}),
		});
		const json = await response.json();

		return json;
	}
}

module.exports = capmonster;

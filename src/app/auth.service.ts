import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	token: string;
	constructor() {}

	setToken(token: string) {
		this.token = token;
	}

	getToken() {
		return this.token;
	}
}

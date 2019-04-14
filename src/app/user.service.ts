import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, forkJoin, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from './user_interface'; 

@Injectable({
	providedIn: 'root'
})
export class UserService {
	user$: Observable<User>;
	token: string;
	public user = {
	    id: null,
	    username: "",
	    quotes: ""
	  };
	private _user: BehaviorSubject<User>;

	constructor(private http: HttpClient, private router: Router) {
		this._user = <BehaviorSubject<User>>new BehaviorSubject({});
		this.user$ = this._user.asObservable();
	}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);

			return of(result as T);
		};
	}


	login({ username, password }) {
		
		const httpOptions = {
			headers: new HttpHeaders({
			})
		};

		return this.http
			.post('http://localhost:1234/api/login', { username, password }, httpOptions)
			.pipe(catchError(this.handleError('login')));
	}

	logout() {
		localStorage.clear();
		this.setUser({
			id: 1,
			username: '',
			quotes: ''
		});
		this.router.navigate(['/login']);
	}

	// TODO typeof any to actual type
	authenticate(token): Observable<any> {
		console.log(`userService.authenticate`);
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-type': 'application/json'
			})
		};

		return this.http
			.post('http://localhost:1234/api/auth', { token }, httpOptions)
			.pipe(catchError(this.handleError('authenticate')));
	}

	setUser(user) {
		this._user.next(user);
	}

	getUser() {
		return this.user;
	}

	setToken(token: string) {
		console.log(`setToken`, token);	
		this.token = token;

		console.log(this.getToken());
	}

	getToken() {
		return this.token;
	}
}

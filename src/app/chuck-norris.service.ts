import { OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Quote } from './quote_interface';
import { UserService } from './user.service'; 

@Injectable({
	providedIn: 'root'
})
export class ChuckNorrisService implements OnInit {
	constructor(private http: HttpClient, private userService: UserService) {}

	private handleError<T>(operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {
			console.error(error);

			return of(result as T);
		};
	}

	ngOnInit () {
		console.log(this.userService.getToken(), this.userService.token);
	}

	getQuotes() {
		// Not the greatest way to perform 10 requests though can be changed later.
		const jokes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		let requests = [];
		for (let joke of jokes) {
			requests.push(
				this.http
					.get('https://api.chucknorris.io/jokes/random')
					.pipe(catchError(this.handleError('getQuotes')))
			);
		}

		return forkJoin(requests);
	}

	saveFavoriteQuotes(quotes) {
		let token = this.userService.getToken();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('access_token')
			})
		};

		return this.http
			.post('http://localhost:1234/api/saveFavoriteQuotes', { quotes }, httpOptions)
			.pipe(catchError(this.handleError('saveFavoriteQuote')));
	}
}

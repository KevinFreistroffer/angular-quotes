import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { UserService } from './user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
	appTitle: string = 'Chuck Norris';

	constructor(private userService: UserService, private router: Router) {}

	ngOnInit() { 
		try {
	    	let jwt = localStorage.getItem('access_token');
	    	if (jwt) {
	    		this.userService.authenticate(jwt)
	    		.subscribe((response) => {
	    			if (response.status === 200) {
	    			    this.userService.setUser(response.data);
	    				if (this.router.url.indexOf('dashboard') === -1) {
	    					this.router.navigate(['/dashboard']);
	    				}
	    			} else {
	    				console.log('An error occured authenticating', response.error);
	    			}
	    		},
	    		error => {
	    			console.log(error);
	    		});
	    	}
		} catch(error) {

		}

		document.title = "Quotes";
	}

	logout() {
		this.userService.logout();
	}
}
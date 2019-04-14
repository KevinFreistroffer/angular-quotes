import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../user_interface";
import { UserService } from "../user.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
	viewTitle: string = "Login";

	user = {
		username: "",
		password: ""
	};

	constructor(private userService: UserService, private router: Router) {}

	ngOnInit() {
		document.title = "Login";
	}

	handleOnSubmit() {
		if (
			this.user.username.trim() !== "" &&
			this.user.password.trim() !== ""
		) {
			this.userService.login(this.user).subscribe(
				response => {
					if (response.status === 200 && response.token) {						
						this.userService.setToken(response.token);
						this.userService.setUser(response.user);
						try {
							if (localStorage.getItem("access_token")) {
								localStorage.removeItem("access_token");

								localStorage.setItem(
									"access_token", response.token
								);
							} else {
								localStorage.setItem(
									"access_token",  response.token
								);
							}

							this.userService.setUser(response.user);
						} catch (error) {
							console.log(
								`An error occured saving a JWT to localStorage`,
								error
							);
						}
					
						this.router.navigate(["/dashboard"]);
					}
				},
				error => {
					console.log(`An error occured signing in`, error);
				}
			);
		} else {
			alert("Username and password are requried");
		}
	}
}

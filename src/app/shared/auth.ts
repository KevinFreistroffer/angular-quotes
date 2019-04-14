(function() {
	let token;

	function setToken(jwt) {
		let innerToken = token;
		this.token = innerToken;
		return function() {
			this.innerToken = jwt;
		}
	}

	function Token(token) {
		this.token = token;
	}
})();
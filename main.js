var app = new Vue ({
	el: '#app',
	data: {
		product: 'Socks',
		description: "This is a pair of socks",
		image: '\socks.jpeg',
		google: 'https://www.google.com/',
		inStock: this.inventory > 0,
		inventory: 8,
		onSale: true
	}
});

var banner = new Vue({
	el:"#banner",
	data: {
		banner:true
	}
})

var eventBus = new Vue ()

Vue.component('product', {
	props: {
		premium: {
			type: Boolean,
			required: true
		}
	},
	template: `		
	<div class="product">
		<div class="banner">
			<span v-if="onSale" style="color:green">{{saleMessage}}</span>
		</div>
		<div class="product-image">
			<img v-bind:src="image">
		</div>

		<div class="product-info">
			<h1>{{title}}</h1>
			{{description}}
			<p v-if="inStock">In Stock</p>
			<p v-else :class="{outOfStockClass :!inStock}">Out of Stock</p>
			<p>Shipping: {{ shipping }}</p>
			Sizes:<span v-for="size in sizes"> {{size}}  </span>
			<ul>
				<li v-for="detail in details"> {{detail}}</li>
			</ul>

			<div v-for="(varient, index) in varients" 
				:key="varient.varientId"
				class="color-box"
				:style="{backgroundColor: varient.varientColor}"
				@mouseover="updateProduct(index)">
			</div>

			<div class="googleLink">
				Click <a :href="google">here</a> to go to google.
			</div>

			<button @click="addToCart" :disabled="!inStock"
				:class="{disabledButton:!inStock}">Add to Cart</button>
			<button @click="removeFromCart">Remove From Cart</button>
		</div>

		<product-tabs :reviews="reviews"></product-tabs>
	</div>
	`,
	data(){
		return {
			product: 'Socks',
			brand: 'Awesome',
			description: "This is a pair of socks",
			selectedVarient: 0,
			google: 'https://www.google.com/',
			details: ["80% cotton", "20% polyester", "Gender-neutral"],
			varients:[
				{
					varientId:2234,
					varientColor: "green",
					varientImage: '\socks.jpeg',
					varientQuntity: 10,
					onSale : false,
				},
				{
					varientId:2235,
					varientColor: "blue",
					varientImage: '\socksBlue.jpeg',
					varientQuntity: 10,
					onSale : true,
				}
			],
			sizes:["Small","Medium","Large"],
			reviews: []
		}
	},
	methods: {
		addToCart: function(){
			this.$emit('update-cart', this.varients[this.selectedVarient].varientId)
		},
		updateProduct: function(index){
			this.selectedVarient = index
		},
		removeFromCart: function(){
			//Passing nothing will remove an item from the cart.
			this.$emit('update-cart')
		}
	},
	computed: {
		title (){
			return this.brand + this.product
		},
		image() {
			return this.varients[this.selectedVarient].varientImage
		},
		inStock(){
			return this.varients[this.selectedVarient].varientQuntity
		},
		onSale (){
			return this.varients[this.selectedVarient].onSale
		},
		saleMessage(){
			return "These " + this.title + " are on sale!"
		},
		shipping(){
			if (this.premium){
				return "Free"
			} else {
				return 2.99
			}
		}
	},
	mounted(){
		eventBus.$on('review-submitted', productReview => {
			this.reviews.push(productReview)
		})
	}
})

Vue.component('product-tabs', {
	props:{
		reviews: {
			type:Array,
			required: true
		}
	},
	template: `
		<div>
			<span class="tab"
				:class="{ activeTab: selectedTab === tab }"
				v-for="(tab,index) in tabs" 
				:key="index"
				@click="selectedTab = tab">
				{{ tab }}</span>

				<div v-show="selectedTab === 'Reviews'">
				<h2>Reviews</h2>
				<p v-if="reviews.length == 0">There are no reviews yet.</p>
				<ul>
					<li v-for="review in reviews">
						<p>{{ review.name }}</p>
						<p>Rating: {{ review.rating}}</p>
						<p>Review: {{ review.review}}</p>
						<p>Recommend: {{review.recommend}}</p> 
					</li>
				</ul>
			</div>		
	
			<product-review v-show="selectedTab === 'Make a Review'"></product-review>
		</div>
	`,
	data(){
		return{
			tabs: ['Reviews', 'Make a Review'],
			selectedTab: 'Reviews'
		}
	}
})

Vue.component('product-review', {
	template:`
	<form class="review-form" @submit.prevent="onSubmit">
		<p v-if="errors.length">
			<b> Please correct the following error(s):</b>
			<ul>
				<li v-for="error in errors">{{error}}</li>
			</ul>
		</p>

		<p>
			<label for="name">Name:</label>
			<input id="name" v-model="name">
		</p>

		<p>
			<label for="review">Review:</label>
			<textarea id="review" v-model="review"></textarea>
		</p>
		<p>
			<label for="rating">Rating:</label>
			<select id = "rating" v-model.number="rating">
				<option>5</option>
				<option>4</option>
				<option>3</option>
				<option>2</option>
				<option>1</option>
			</select>
		</p>
		<p>
			<p> Would you recommend this product?</p>
			<div>
				<label for="yesRec">Yes</label>
				<input align="left" id="yesRec" type="radio" v-model="recommend" value="Yes"/>
			</div>
			<div>
				<label for="noRec">No</label>
				<input align="left" id="noRec" type ="radio" v-model="recommend" value="No"/>
			</div>
		</p>
		<p>
			<input type="submit" value="Submit">
		</p>
	</form>
	`,
	data(){
		return {
			review: null,
			rating:null,
			name:null,
			recommend:null,
			errors:[],
		}
	},
	methods:{
		onSubmit(){
			this.errors = []

			if(this.name && this.review && this.rating && this.recommend){
				let productReview = {
					name: this.name,
					review: this.review,
					rating: this.rating,
					recommend: this.recommend
				}
				eventBus.$emit('review-submitted', productReview)
				this.name = null
				this.rating = null
				this.review = null
				this.recommend = null
			} else{
				if(!this.name) this.errors.push("Name required")
				if(!this.review) this.errors.push("Review required")
				if(!this.rating) this.errors.push("Rating required")
				if(!this.recommend) this.errors.push("Recomendation required")
			}
		}
	}
})

var app = new Vue ({
	el: '#app',
	data: {
		premium: true,
		cart: [],
	},
	methods: {
		updateCart(id){
			if (id != null){
				this.cart.push(id)
			} else {
				this.cart.pop()
			}
		}
	}
})

//crux here is the button and div target to change button into new HTML
//local storage and its behaviour new here
//getItem comes with parse() and setItem with stringify()

var productList = []; //storing all json formatted products

async function getAllProducts(){ //window.onload();
   
    let products = await fetch('https://dummyjson.com/products'); //fakestoreapi
    productList = await products.json();
    productList = productList.products; // all products in array
   console.log(productList);
    showProducts(); //default will take productList

}
//showProduct() after async will give null as it processes parallely
getAllProducts();

//resuing this function for search in array
function showProducts(products = productList){ //default param given that'll work when arg passing or not 

    let html = `<div class="row row-item">` //grid of css

    for(i=0;i<products.length;i++){

        html += `
        <div class="col-sm-3">

        <div class="single-item">

            <div class="image">

                <img class = "product-image" src="${products[i].thumbnail}" alt="image to be loaded">

            </div>

            <div class="product-name">${products[i].title}</div>
            <div class="product-price">₹${products[i].price}</div>
            
            <span id="divpr${products[i].id}" >

            <button id="pr${products[i].id}" class="add-to-cart btn btn-primary">
                add to cart
            </button>
            </span>
        </div>

   </div>
        `

        if((i+1)%4 == 0){
            html += `</div> <div class="row row-item"> `
        }

    }

    html += `</div>`

    document.getElementById('product-list').innerHTML = html;
    setClickEventOnCart(); //click on add-to-cart functionality
    updateCart();//shows even after reload
}

function setClickEventOnCart(){
    //button class fetch
    let addToCart = document.getElementsByClassName('add-to-cart'); //class looping faster
   
    for(i=0;i<addToCart.length;i++){
        //product to local storage and if item is same increase qty
        addToCart[i].addEventListener('click' ,function(){
            let cartItem = {}; //object addition to storage is done in string
            //cartId  'cart' => key
            if(localStorage.getItem('cart') !== null){
                cartItem = JSON.parse(localStorage.getItem('cart'));
            }
            console.log(this.id); //whole tag returned and id retrieved

            let idstr = this.id.toString();

            if(cartItem[idstr] === undefined){//add to cart is id wale product ke lie abhi first time click hua hai
                cartItem[idstr] = 1; //new item added
            }else{
                cartItem[idstr] += 1; //updated existing item 
            }

            console.log(cartItem);

            localStorage.setItem('cart' ,JSON.stringify(cartItem));

            updateCart(); //whenever add to cart is clicked
            
        })
    }
}

function updateCart(){

    if(localStorage.getItem('cart') !== null){
        let cartItem = JSON.parse(localStorage.getItem('cart'));
        let count = 0;
        //local storage is doing object {} form storage of ids
        for(let item in cartItem){

            count += cartItem[item];
            //cart symbol counter updated

            //all button/productId Id fetched by item
            // console.log(item , cartItem[item]);

            //button changed and value from object 
            document.getElementById("div"+item).innerHTML = 
            `
                <button class="btn btn-primary" onclick="updateQty('-','${item}')">-</button>
                <span class="item-count"> ${cartItem[item]} </span>
                <button class="btn btn-primary" onclick="updateQty('+','${item}')">+</button>

            `;
        }
        document.getElementById('cart-item-count').innerHTML = count; //always outside loop
        
    }
}


function updateQty(optr ,id ,type='page'){//default param
    let cartItem = JSON.parse(localStorage.getItem('cart'));

    if(optr === '+'){
        cartItem[id] = cartItem[id] + 1;
    }
    else{
        if(cartItem[id] === 1){ //1 se 0 aaye to delete krdo from localStorage not zero in button
            
            if(type === 'cart'){//passing from -ive btn inside cart
                if(confirm("remove this item?")) //yes no cmd prompt yes will run if and no will not
                delete cartItem[id]; //id==item==cart(Id)==key === prId
            }
            else{
                 delete cartItem[id]; //id==item==cart(Id)==key === prId
  
                //remove karke waps button aana chaiye
                document.getElementById('div'+id).innerHTML = `
                <button id="${id}" class="add-to-cart btn btn-primary">
                add to cart
                </button>
                `; //${id} gives grid above
              }

            //reset like new fresh button when clicked
            setClickEventOnCart();
            }   
            else{
                cartItem[id] = cartItem[id] - 1;
            }
        }

        localStorage.setItem('cart' ,JSON.stringify(cartItem));

        updateCart();//shows data on cart counter
        showCartItem();//updates in both page and cart
 }

function searchProduct(id){
    return productList.filter((item)=>{
        return item.id === id; //true
    })//returns matched product
}


//the buttons call the same function inside of cart as that of main page and udpateQty
function showCartItem(){
    var cartItem = localStorage.getItem('cart');
    
    if(cartItem !== null){
        cartItem = JSON.parse(cartItem);
        // console.log(cartItem); pr1 , pr3 ...etc 

        let html = "";
        let totalAMount = 0;

        for(let item in cartItem){
            //only id fetched from pr1 as pr is prefix and 1 is id in string data  type
            let id = parseInt(item.replace("pr","")); 
            let product = searchProduct(id); //returns a single product
            totalAMount += product[0].price * cartItem[item]; 
           
            if(product.length > 0){
                //product[0] to access its properties
                html += `
                 <div class="row">
                <div class="col-sm-2">
                  <img class="cart-image" src="${product[0].thumbnail}"> 
                </div>
                <div class="col-sm-4">
                  <h5>${product[0].title}</h5>
                  <h6>${product[0].category}</h6>
                </div>
                <div class="col-sm-3">
                  <button class="btn btn-primary" onclick="updateQty('-' , '${item}' , 'cart')" 
                  > - </button>
                <span class="item-count">${cartItem[item]}</span>
                <button class="btn btn-primary" onclick="updateQty('+' , '${item}')">
                   + </button>
                </div>
                <div  class="col-sm-1" style="text-align: left;">₹${product[0].price}</div>
                <div  class="col-sm-2">₹${product[0].price * cartItem[item]}</div>
              </div>        
                `;
            }
                // console.log(product);
         }
         document.getElementById('cart-item-list').innerHTML = html;

         document.getElementById("total-amount").innerHTML = '₹' + totalAMount;
    }
}

var searchId = document.getElementById('search');
searchId.addEventListener('keyup' , function(){
    console.log(this.value);

    let searchList = productList.filter((item)=>{ //returns a list in return
        return item.title.toLowerCase().includes(this.value.toLowerCase());
    })

    showProducts(searchList); //searchList replaces default param

})

//  function searchItem(){

//     let val = document.getElementById('search').value;

//     productList.filter((item)=>{
//         item.title.toLowerCase().includes(val.toLowerCase());

//     }


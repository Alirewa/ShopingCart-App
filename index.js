import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");

let cart = [];
// 1. get product
class Products {
    getProduct() {
      return productsData;
    }
  }
  let buttonsDOM = [];
// 2. display products
class UI{

    displayProducts(products) {

    let result = "";

    products.forEach((item) => {

      result += `<div class="product">
      <div class="img-container">
        <img src=${item.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${item.price}</p>
        <p class="product-title">${item.title}</p>
      </div>
      <button class="btn add-to-cart " data-id=${item.id}>
        Add To Cart
      </button>
    </div>`;
      productsDOM.innerHTML = result;
    });
  };
  getAddtocartBtns() {
    const addTocartBtn = [... document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addTocartBtn;

    addTocartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      const isIncart = cart.find(p => p.id === parseInt(id));
      if(isIncart) {
        btn.innerText = `In Cart`;
        btn.disabled = true;
      };
      btn.addEventListener("click" , (event) => {
        event.target.innerText = `In Cart`;
        event.target.disabled = true;

        const addedProduct = {...Storage.getProduct(id), quantity: 1};

        cart = [...cart ,addedProduct];
        
        Storage.saveCart(cart);
        // update cart value
        this.setCartValue(cart);
        // add to cart item
        this.addCartItem(addedProduct);
      });
    });
  };

  setCartValue(cart) {
    let tempCartItems= 0;
    const totalPrice = cart.reduce((acc,curr) => {
      tempCartItems += curr.quantity;
        return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total Price: ${totalPrice.toFixed(2)}$`;
    cartItems.innerText = tempCartItems;
    // console.log(tempCartItems);
  };
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <div class="cart-item">
    <img class="cart-item-img" src= ${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
    </div>
  </div>
  <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;
  cartContent.appendChild(div);
  };
  setupApp() {
    // get cart from storage
    cart = Storage.getCart();
    // add cart item to modal cart
    cart.forEach(cartItem => this.addCartItem(cartItem)); // loop chand taii
    // setValues
    this.setCartValue(cart);
  };
  cartLogic() {
    // clear cart
    clearCart.addEventListener("click", () => this.clearCart());
    // cart functionality
    cartContent.addEventListener("click" , (event) => {
      if(event.target.classList.contains("fa-chevron-up")) {
        const addQuantity = event.target;
        // 1. get item from cart
        const addedItem = cart.find((citem) => citem.id == addQuantity.dataset.id);
        addedItem.quantity++;
        // 2. update cart value
        this.setCartValue(cart);
        // 3. save cart
        Storage.saveCart(cart);
        // 4. update quanty ui value
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if(event.target.classList.contains("fa-trash-alt")) {
        const removeItem = event.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
        // remove from cartitem
        // remove()
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const subQuantity = event.target;
        const substractedItem = cart.find((c) => c.id == subQuantity.dataset.id);

        if(substractedItem.quantity === 1) {
          this.removeItem(substractedItem.id);
          cartContent.removeChild(subQuantity.parentElement.parentElement);
          return;
        }
        substractedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        subQuantity.previousElementSibling.innerText = substractedItem.quantity;
      }
    });
  };
  clearCart() {
          // remove: (dont reapet your code)
          cart.forEach(cItem => this.removeItem(cItem.id));
          // remove cart content childeren
          while(cartContent.children.length) {
            cartContent.removeChild(cartContent.children[0]);
          };
          closeModalFunction();
  };
  removeItem(id) {
    // update cart
    cart = cart.filter( cItem => cItem.id !== id);
    // update total value
    this.setCartValue(cart);
    // update storage
    Storage.saveCart(cart);
    // get add to cart buttons => update text and disable
    this.getsinglebutton(id);
};
getsinglebutton(id) {
  const button = buttonsDOM.find((btn) => parseInt(btn.dataset.id) === parseInt(id));
  button.innerText = "Add To Cart";
  button.disabled = false;
};
};
// 3. storage
class Storage{
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  };
  static getProduct(id){
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  };
  static saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  };
  static getCart(){
    return JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart"))
     : [];
  };
};
  document.addEventListener("DOMContentLoaded" , () => {

      const products = new Products();
      const productsData = products.getProduct();
      const ui = new UI();
      ui.setupApp();
      ui.displayProducts(productsData)
      ui.getAddtocartBtns();
      ui.cartLogic();
      Storage.saveProducts(productsData);
      // console.log(productsData);
    })

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
};

function closeModalFunction () {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "100%";
};

cartBtn.addEventListener("click" , showModalFunction);
closeModal.addEventListener("click" , closeModalFunction);
backDrop.addEventListener("click" , closeModalFunction);
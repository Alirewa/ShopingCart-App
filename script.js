import { productsData } from "./products.js";
const productsList = document.querySelector(".products-center"); // for show on dom products
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");
let cart = [];

class Products {
  // from api or json file on local
  getProduct() {
    return productsData;
  }
}
let buttonsDom = [];
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
            <div class="img-container">
              <img src=${item.imageUrl} class="product-img" />
            </div>
            <div class="product-desc">
              <p class="product-price">$${item.price}</p>
              <p class="product-title">${item.title}</p>
            </div>
            <button class="btn add-to-cart" data-id=${item.id}>
            <i class="fas fa-shopping-cart"></i>
            Add To Cart
            </button>
            </div>`;
      productsList.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")]; // get all "add to cart" buttons in array
    buttonsDom = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      // check if this product id is in cart or not
      const isInCart = cart.find((p) => p.id == id);
      if (isInCart) {
        btn.innerText = "in cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        cart = [...cart, addedProduct];

        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotal.innerText = `Total Price: ${totalPrice.toFixed(2)}$`;
    cartItems.innerText = tempCartItems;
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>${cartItem.price}</h5>
            </div>
            <div class="cart-item-conteoller">
              <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
           <i class="far fa-trash-alt" data-id=${cartItem.id}></i>
`;
    cartContent.appendChild(div);
  }
  setupApp() {
    cart = Storage.getCart() || [];
    cart.forEach((cartItem) => this.addCartItem(cartItem));

    this.setCartValue(cart);
  }
  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());

    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-chevron-up")) {
        console.log(e.target.dataset.id);
        const addQuantity = e.target;
        const addedItem = cart.find(
          (citem) => citem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        addQuantity.nextElementSibling.innerText = addedItem.quantity;
      } else if (e.target.classList.contains("fa-trash-alt")) {
        const removeItem = e.target;
        const _removedItem = cart.find((c) => c.id == removeItem.dataset.id);
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      } else if (e.target.classList.contains("fa-chevron-down")) {
        const subQuantity = e.target;
        const substractedItem = cart.find(
          (c) => c.id == subQuantity.dataset.id
        );
        if (substractedItem.quantity === 1) {
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
  }

  clearCart() {
    cart.forEach((citem) => this.removeItem(citem.id));

    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModal();
  }

  removeItem(id) {
    cart = cart.filter((citem) => citem.id !== id);

    this.setCartValue(cart);

    Storage.saveCart(cart);
    this.getSingleButton(id);
  }
  getSingleButton(id) {
    const button = buttonsDom.find((btn) => btn.dataset.id == parseInt(id));
    button.innerText = "Add To Cart";
    button.disabled = false;
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProduct(); // array of products
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});

function modal() {
  const cartBtn = [...document.querySelectorAll(".cart-btn")];
  const cartModal = document.querySelector(".cart");
  const cartBackdrop = document.querySelector(".backdrop");
  const closeModalBtns = document.querySelectorAll(".cart-item-confirm");

  closeModalBtns.forEach((e) => {
    e.addEventListener("click", closeModal);
  });
  cartBtn.forEach((btn) => btn.addEventListener("click", openModal));
  cartBackdrop.addEventListener("click", closeModal);
  cartModal.addEventListener("click", (e) => e.stopPropagation());

  function openModal(e) {
    cartBackdrop.classList.remove("hidden");
    cartModal.classList.remove("hidden");
  }
  function closeModal(e) {
    cartBackdrop.classList.add("hidden");
    cartModal.classList.add("hidden");
  }
}
modal();

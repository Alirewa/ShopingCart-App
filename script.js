import { productsData } from "./products.js";

const productsList   = document.querySelector(".products-center");
const cartTotal      = document.querySelector(".cart-total");
const cartBadge      = document.querySelector(".cart-badge");
const cartContent    = document.querySelector(".cart-content");
const cartEmpty      = document.querySelector(".cart-empty");
const clearCartBtn   = document.querySelector(".clear-cart");
const productsCount  = document.querySelector(".products-count");
const toast          = document.querySelector(".toast");
const toastMsg       = document.querySelector(".toast-msg");

let cart = [];
let buttonsDom = [];
let toastTimer;

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function showToast(msg) {
  clearTimeout(toastTimer);
  toastMsg.textContent = msg;
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

function bumpBadge() {
  cartBadge.classList.remove("bump");
  void cartBadge.offsetWidth; // force reflow to restart animation
  cartBadge.classList.add("bump");
}

// ── Products ─────────────────────────────────────────────────
class Products {
  getProduct() {
    return productsData;
  }
}

// ── UI ───────────────────────────────────────────────────────
class UI {
  displayProducts(products) {
    productsList.innerHTML = products
      .map(
        (item) => `
      <div class="product">
        <div class="img-container">
          <img src="${item.imageUrl}" class="product-img" alt="${item.title}" loading="lazy" />
        </div>
        <div class="product-body">
          <p class="product-title">${item.title}</p>
          <p class="product-price">${formatPrice(item.price)}</p>
        </div>
        <div class="product-footer">
          <button class="btn add-to-cart" data-id="${item.id}">
            <i class="fas fa-shopping-cart"></i>
            افزودن به سبد
          </button>
        </div>
      </div>`
      )
      .join("");

    if (productsCount) {
      productsCount.textContent = `${products.length} محصول`;
    }
  }

  getAddToCartBtns() {
    const btns = [...document.querySelectorAll(".add-to-cart")];
    buttonsDom = btns;

    btns.forEach((btn) => {
      const id = btn.dataset.id;
      if (cart.find((p) => p.id == id)) {
        btn.innerHTML = '<i class="fas fa-check"></i> در سبد خرید';
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        btn.innerHTML = '<i class="fas fa-check"></i> در سبد خرید';
        btn.disabled = true;

        const product = { ...Storage.getProduct(id), quantity: 1 };
        cart = [...cart, product];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(product);
        this.updateEmptyState();
        showToast("محصول به سبد خرید اضافه شد ✓");
        bumpBadge();
      });
    });
  }

  setCartValue(cart) {
    let totalQty = 0;
    const totalPrice = cart.reduce((acc, item) => {
      totalQty += item.quantity;
      return acc + item.quantity * item.price;
    }, 0);

    if (cartTotal) cartTotal.textContent = formatPrice(totalPrice);
    if (cartBadge) cartBadge.textContent = totalQty;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img class="cart-item-img" src="${item.imageUrl}" alt="${item.title}" />
      <div class="cart-item-desc">
        <h4>${item.title}</h4>
        <h5>${formatPrice(item.price)}</h5>
      </div>
      <div class="cart-item-conteoller">
        <i class="fas fa-chevron-up"   data-id="${item.id}"></i>
        <p>${item.quantity}</p>
        <i class="fas fa-chevron-down" data-id="${item.id}"></i>
        <i class="far fa-trash-alt"   data-id="${item.id}"></i>
      </div>`;
    cartContent.appendChild(div);
  }

  setupApp() {
    cart = Storage.getCart() || [];
    cart.forEach((item) => this.addCartItem(item));
    this.setCartValue(cart);
    this.updateEmptyState();
  }

  updateEmptyState() {
    if (!cartEmpty) return;
    cart.length === 0
      ? cartEmpty.classList.remove("hidden")
      : cartEmpty.classList.add("hidden");
  }

  cartLogic() {
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => this.clearCart());
    }

    cartContent.addEventListener("click", (e) => {
      const target = e.target;

      if (target.classList.contains("fa-chevron-up")) {
        const item = cart.find((c) => c.id == target.dataset.id);
        item.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        target.nextElementSibling.textContent = item.quantity;

      } else if (target.classList.contains("fa-chevron-down")) {
        const item = cart.find((c) => c.id == target.dataset.id);
        if (item.quantity === 1) {
          this.removeItem(item.id);
          cartContent.removeChild(target.closest(".cart-item"));
          this.updateEmptyState();
          return;
        }
        item.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        target.previousElementSibling.textContent = item.quantity;

      } else if (target.classList.contains("fa-trash-alt")) {
        const item = cart.find((c) => c.id == target.dataset.id);
        this.removeItem(item.id);
        cartContent.removeChild(target.closest(".cart-item"));
        this.updateEmptyState();
      }
    });
  }

  clearCart() {
    cart.forEach((item) => this.removeItem(item.id));
    cartContent.innerHTML = "";
    this.updateEmptyState();
    closeModal();
  }

  removeItem(id) {
    cart = cart.filter((c) => c.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const btn = buttonsDom.find((b) => b.dataset.id == id);
    if (btn) {
      btn.innerHTML = '<i class="fas fa-shopping-cart"></i> افزودن به سبد';
      btn.disabled = false;
    }
  }
}

// ── Storage ──────────────────────────────────────────────────
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    return products.find((p) => p.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const data = products.getProduct();
  const ui = new UI();

  Storage.saveProducts(data);
  ui.setupApp();
  ui.displayProducts(data);
  ui.getAddToCartBtns();
  ui.cartLogic();
});

// ── Modal ────────────────────────────────────────────────────
const cartBtn      = document.querySelector(".cart-btn");
const cartModal    = document.querySelector(".cart");
const cartBackdrop = document.querySelector(".backdrop");
const cartCloseBtn = document.querySelector(".cart-close-btn");
const confirmBtn   = document.querySelector(".cart-item-confirm");

function openModal()  {
  cartBackdrop.classList.remove("hidden");
  cartModal.classList.remove("hidden");
}
function closeModal() {
  cartBackdrop.classList.add("hidden");
  cartModal.classList.add("hidden");
}

if (cartBtn)      cartBtn.addEventListener("click", openModal);
if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeModal);
if (confirmBtn)   confirmBtn.addEventListener("click", closeModal);
if (cartBackdrop) cartBackdrop.addEventListener("click", closeModal);
if (cartModal)    cartModal.addEventListener("click", (e) => e.stopPropagation());

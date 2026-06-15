# Shopping Cart App — Vanilla JavaScript

A fully client-side **Persian (Farsi) shopping cart** web application built with pure Vanilla JavaScript. Supports RTL layout, Persian numerals, Toman currency, localStorage persistence, and a modern responsive UI — no frameworks, no build step required.

**[Live Demo →](https://alirewa.github.io/ShopingCart-App)**

[![Live Demo](https://img.shields.io/badge/Live_Demo-→-7c3aed?style=for-the-badge)](https://alirewa.github.io/ShopingCart-App)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## Features

- **RTL Persian UI** — Vazirmatn font, right-to-left layout, Persian numerals
- **Add to cart** — single click, button state updates instantly
- **Quantity control** — increment, decrement, or remove items
- **Toman pricing** — prices formatted with `fa-IR` locale (e.g. ۱۲۰٬۰۰۰ تومان)
- **localStorage persistence** — cart survives page refreshes
- **Toast notifications** — feedback on every add-to-cart action
- **Empty cart state** — friendly message when cart is empty
- **Animated badge** — cart item count bumps on update
- **Fully responsive** — 2–4 column grid adapts from mobile to desktop

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Vanilla JavaScript (ES6+) | Cart logic, DOM manipulation, localStorage |
| HTML5 / CSS3 | RTL layout, CSS Grid & Flexbox, CSS custom properties |
| Vazirmatn (Google Fonts) | Persian-optimized typeface |
| Font Awesome 5 | UI icons |
| localStorage API | Client-side cart persistence |
| GitHub Pages + Actions | Automated static deployment |

---

## Getting Started

No build step or dependencies required:

```bash
git clone https://github.com/Alirewa/ShopingCart-App.git
cd ShopingCart-App
# Open index.html in your browser, or serve with any static server:
npx serve .
```

Or use the **[live demo](https://alirewa.github.io/ShopingCart-App)** directly.

---

## Project Structure

```
ShopingCart-App/
├── index.html       # RTL HTML shell
├── style.css        # Persian-first responsive styles
├── script.js        # Cart logic (ES6 classes + localStorage)
├── products.js      # Product data (Persian names, Toman prices)
├── images/          # Product images
└── .github/
    └── workflows/
        └── static.yml   # GitHub Pages auto-deploy
```

---

## How It Works

Products are loaded from `products.js` and rendered to the DOM. When a user adds an item, the product is saved to `localStorage` via the `Storage` class and the cart UI is updated. On page reload, the cart state is restored from `localStorage` so no data is lost between sessions.

---

## License

Distributed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">
Made by <a href="https://github.com/Alirewa">Alirewa</a>
</div>

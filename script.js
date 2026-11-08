// =======================================
// SHOP SETTINGS — UPDATE THESE YOURSELF
// =======================================

const SHOP = {
    name: "Sibtain Electricals",
    city: "Kanpur",
    area: "Becon Ganj",

    // Replace with the shop's WhatsApp number.
    // Format: country code + number, digits only.
    // Example format for India: 919876543210
    whatsapp: "917275522446",

    // Keep false until the shop's prices are verified.
    showDemoPrices: false
};


// =======================================
// PRODUCT DATA
// Add, edit or remove products here.
// Use null for a price that is not confirmed.
// =======================================

const products = [
    {
        id: 1,
        name: "Electrical Wire",
        category: "Wires & Cables",
        icon: "🔌",
        description: "Electrical wiring products. Ask about available sizes.",
        price: null
    },
    {
        id: 2,
        name: "LED Bulb",
        category: "Lights",
        icon: "💡",
        description: "LED lighting. Ask about wattage and brands.",
        price: null
    },
    {
        id: 3,
        name: "Switches & Sockets",
        category: "Switches",
        icon: "🔘",
        description: "Electrical switches and socket accessories.",
        price: null
    },
    {
        id: 4,
        name: "Ceiling Fan",
        category: "Fans",
        icon: "🌀",
        description: "Ask about available models and sizes.",
        price: null
    },
    {
        id: 5,
        name: "MCB",
        category: "Electrical Protection",
        icon: "⚡",
        description: "Circuit protection products. Ask about ratings.",
        price: null
    },
    {
        id: 6,
        name: "Heater Plate",
        category: "Heating Products",
        icon: "♨️",
        description: "Ask about available heater plate types and sizes.",
        price: null
    },
    {
        id: 7,
        name: "Heating Element",
        category: "Heating Products",
        icon: "〰️",
        description: "Ask about wattage, dimensions and compatibility.",
        price: null
    },
    {
        id: 8,
        name: "Electrical Accessories",
        category: "Accessories",
        icon: "🔧",
        description: "Ask us about other electrical supplies.",
        price: null
    }
];


// =======================================
// WEBSITE LOGIC
// =======================================

const categories = [
    { name: "Wires & Cables", icon: "🔌" },
    { name: "Lights", icon: "💡" },
    { name: "Switches", icon: "🔘" },
    { name: "Fans", icon: "🌀" },
    { name: "Electrical Protection", icon: "⚡" },
    { name: "Heating Products", icon: "♨️" },
    { name: "Accessories", icon: "🔧" }
];

let cart = [];
let selectedCategory = "All";

const productGrid = document.getElementById("product-grid");
const categoryList = document.getElementById("categories");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
const cartPanel = document.getElementById("cart-panel");
const cartOverlay = document.getElementById("cart-overlay");

function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

function getProductPrice(product) {
    if (product.price !== null) {
        return product.price;
    }

    if (SHOP.showDemoPrices) {
        return null;
    }

    return null;
}

function priceLabel(product) {
    const price = getProductPrice(product);

    return price === null
        ? "Price on enquiry"
        : formatPrice(price);
}

function renderCategories() {
    categoryList.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");

        button.className =
            "category-card" +
            (selectedCategory === category.name ? " active" : "");

        button.innerHTML = `
            <span class="category-icon">${category.icon}</span>
            <h3>${category.name}</h3>
        `;

        button.addEventListener("click", () => {
            selectedCategory =
                selectedCategory === category.name
                    ? "All"
                    : category.name;

            categoryFilter.value = selectedCategory;
            renderCategories();
            renderProducts();
            document.getElementById("products").scrollIntoView({
                behavior: "smooth"
            });
        });

        categoryList.appendChild(button);
    });
}

function renderProducts() {
    const search = searchInput.value.trim().toLowerCase();

    const filtered = products.filter(product => {
        const matchesSearch = (
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search)
        );

        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    productGrid.innerHTML = "";

    if (filtered.length === 0) {
        productGrid.innerHTML = `
            <p class="empty-message">
                No products found. Try another search.
            </p>
        `;
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-art" aria-hidden="true">
                ${product.icon}
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <p class="product-price">
                    ${priceLabel(product)}
                </p>

                <div class="product-actions">
                    <button class="add-cart">
                        Add to Cart
                    </button>

                    <button class="ask-price">
                        Ask Price
                    </button>
                </div>
            </div>
        `;

        card.querySelector(".add-cart").addEventListener("click", () => {
            addToCart(product.id);
        });

        card.querySelector(".ask-price").addEventListener("click", () => {
            sendWhatsApp(
                `Hello ${SHOP.name}, I want to enquire about ${product.name}.`
            );
        });

        productGrid.appendChild(card);
    });
}

function populateCategoryFilter() {
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    renderCart();
    openCart();
}

function changeQuantity(productId, amount) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-message">Your cart is empty.</p>
        `;

        cartTotal.textContent = "Total: Price on enquiry";
        return;
    }

    let knownTotal = 0;
    let hasUnknownPrice = false;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const price = getProductPrice(product);

        if (price === null) {
            hasUnknownPrice = true;
        } else {
            knownTotal += price * item.quantity;
        }

        const row = document.createElement("div");
        row.className = "cart-item";

        const title = document.createElement("h3");
        title.textContent = product.name;

        const priceText = document.createElement("p");
        priceText.textContent =
            `${priceLabel(product)} × ${item.quantity}`;

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.setAttribute("aria-label", `Remove one ${product.name}`);
        minus.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.setAttribute("aria-label", `Add one ${product.name}`);
        plus.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.className = "remove-item";
        remove.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        controls.append(minus, quantity, plus, remove);
        row.append(title, priceText, controls);
        cartItems.appendChild(row);
    });

    if (hasUnknownPrice) {
        cartTotal.textContent = "Total: Confirm prices on WhatsApp";
    } else {
        cartTotal.textContent = "Total: " + formatPrice(knownTotal);
    }
}

function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");
}

function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");
}

function sendWhatsApp(message) {
    const number = SHOP.whatsapp.replace(/\D/g, "");

    if (!number) {
        alert(
            "Shop WhatsApp number has not been added yet. " +
            "Update SHOP.whatsapp in script.js first."
        );
        return;
    }

    if (!/^\d{10,15}$/.test(number)) {
        alert("Please enter a valid WhatsApp number in script.js.");
        return;
    }

    const url =
        "https://wa.me/" +
        number +
        "?text=" +
        encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Please add a product to your cart first.");
        return;
    }

    const lines = cart.map(item => {
        const product = products.find(p => p.id === item.id);

        return `${product.name} × ${item.quantity} — ${priceLabel(product)}`;
    });

    const message = [
        `Hello ${SHOP.name}!`,
        "I would like to enquire about these products:",
        "",
        ...lines,
        "",
        `Location: ${SHOP.area}, ${SHOP.city}`,
        "",
        "Please confirm availability and final prices."
    ].join("\n");

    sendWhatsApp(message);
}

searchInput.addEventListener("input", renderProducts);

categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value;
    renderCategories();
    renderProducts();
});

document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.getElementById("checkout-whatsapp")
    .addEventListener("click", checkoutWhatsApp);

document.getElementById("contact-whatsapp")
    .addEventListener("click", () => {
        sendWhatsApp(
            `Hello ${SHOP.name}, I would like to enquire about your products.`
        );
    });

document.getElementById("year").textContent = new Date().getFullYear();

populateCategoryFilter();
renderCategories();
renderProducts();
renderCart();

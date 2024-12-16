// Clase Producto utilizando constructor y prototipos
function Producto(name, price, image) {
  this.name = name;
  this.price = price;
  this.image = image;
}

Producto.prototype.getPriceWithTax = function () {
  return this.price * 1.21;
};

// Clase ProductoEnOferta extendida de Producto
function ProductoEnOferta(name, price, image, discount) {
  Producto.call(this, name, price, image); // Hereda propiedades de Producto
  this.discount = discount;
}

ProductoEnOferta.prototype = Object.create(Producto.prototype);
ProductoEnOferta.prototype.constructor = ProductoEnOferta;

ProductoEnOferta.prototype.getPriceWithDiscount = function () {
  const discountedPrice = this.price - this.price * (this.discount / 100);
  return discountedPrice * 1.21;
};

// Lista de productos
const productos = [
  new Producto("Queso de Cabra", 10, "./assets/img/quesodecabra.png"),
  new Producto("Barbacoa", 15, "./assets/img/barbacoa.png"),
  new Producto("Vegetal", 14, "./assets/img/vegetal.png"),
  new Producto("Marina", 15.5, "./assets/img/marina.png"),
  new ProductoEnOferta("Margarita", 8.5, "./assets/img/margarita.png", 20),
  new ProductoEnOferta("4 Quesos", 8.5, "./assets/img/4quesos.png", 20),
];

// Renderizar carrusel
function renderCarousel(products) {
  const carousel = document.getElementById("carousel");
  carousel.innerHTML = "";

  products.forEach((product) => {
    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item";

    const discountedPrice =
      product instanceof ProductoEnOferta
        ? `<p class="product-price"><span class="original-price">${product.price.toFixed(
            2
          )}€</span> <span class="discounted-price">${product
            .getPriceWithDiscount()
            .toFixed(2)}€</span></p>`
        : `<p class="product-price">${product.price.toFixed(2)}€</p>`;

    carouselItem.innerHTML = `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <h3 class="product-name">${product.name}</h3>
        ${discountedPrice}
        <button class="add-to-cart">Añadir al Carrito</button>
      </div>
    `;

    const button = carouselItem.querySelector(".add-to-cart");
    button.addEventListener("click", () => {
      const price =
        product instanceof ProductoEnOferta
          ? product.getPriceWithDiscount()
          : product.price * 1.21;
      addToCart({ name: product.name, price, quantity: 1 });
    });

    carousel.appendChild(carouselItem);
  });

  initCarousel();
}

// Carrusel interactivo
let angle = 0;

function initCarousel() {
  const items = document.querySelectorAll(".carousel-item");
  const itemCount = items.length;
  const theta = 360 / itemCount;

  items.forEach((item, index) => {
    item.style.transform = `rotateY(${theta * index}deg) translateZ(300px)`;
  });

  function updateBlur() {
    items.forEach((item, index) => {
      const currentAngle = (360 + angle + theta * index) % 360; // Calcula el ángulo relativo
      // Si el ángulo está cerca de 0 (o 360), el elemento está en frente
      if (currentAngle > theta / 2 && currentAngle < 360 - theta / 2) {
        item.classList.add("blurred");
      } else {
        item.classList.remove("blurred");
      }
    });
  }

  document.getElementById("nextProducto").addEventListener("click", () => {
    angle -= theta;
    document.getElementById(
      "carousel"
    ).style.transform = `rotateY(${angle}deg)`;
    updateBlur();
  });

  document.getElementById("prevProducto").addEventListener("click", () => {
    angle += theta;
    document.getElementById(
      "carousel"
    ).style.transform = `rotateY(${angle}deg)`;
    updateBlur();
  });

  // Actualiza el desenfoque inicialmente
  updateBlur();
}

// Carrito
let carrito = loadCartFromLocalStorage();
let descuentoAplicado = 0;

const cartButton = document.getElementById("cartButton");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const totalPrice = document.getElementById("total-price");
const discountCodeInput = document.getElementById("discount-code");
const discountMessage = document.getElementById("discount-message");

cartButton.addEventListener("click", () => {
  cart.classList.toggle("active");
});

// Botón para cerrar el carrito
document.getElementById("close-cart").addEventListener("click", () => {
  cart.classList.remove("active");
});

function addToCart(product) {
  const existingProduct = carrito.find((item) => item.name === product.name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    carrito.push(product);
  }

  saveCartToLocalStorage();
  updateCartUI();
}

function updateCartUI() {
  cartItems.innerHTML = "";
  carrito.forEach((product, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item">
        <span>${product.name}</span>
        <div class="quantity-controls">
          <button class="decrease-quantity" data-index="${index}">-</button>
          <span>${product.quantity}</span>
          <button class="increase-quantity" data-index="${index}">+</button>
        </div>
        <span>${(product.price * product.quantity).toFixed(2)}€</span>
        <button class="remove-from-cart" data-index="${index}">X</button>
      </div>
    `;
    cartItems.appendChild(li);
  });

  cartCount.textContent = carrito.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  const subtotal = carrito.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const totalConDescuento = subtotal - (subtotal * descuentoAplicado) / 100;

  totalPrice.textContent = `Total: ${totalConDescuento.toFixed(2)}€`;

  document.querySelectorAll(".remove-from-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      carrito.splice(index, 1);
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  document.querySelectorAll(".decrease-quantity").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      if (carrito[index].quantity > 1) {
        carrito[index].quantity -= 1;
      } else {
        carrito.splice(index, 1);
      }
      saveCartToLocalStorage();
      updateCartUI();
    });
  });

  document.querySelectorAll(".increase-quantity").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      carrito[index].quantity += 1;
      saveCartToLocalStorage();
      updateCartUI();
    });
  });
}

// Guardar carrito en localStorage
function saveCartToLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cargar carrito desde localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem("carrito");
  return savedCart ? JSON.parse(savedCart) : [];
}

// Vaciar carrito
document.getElementById("clear-cart").addEventListener("click", () => {
  carrito = [];
  descuentoAplicado = 0;
  discountMessage.textContent = "";
  discountCodeInput.value = "";
  saveCartToLocalStorage();
  updateCartUI();
});

// Finalizar compra
document.getElementById("checkout").addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("El carrito está vacío. Añade productos antes de proceder al pago.");
    return;
  }

  const productosComprados = carrito
    .map((product) => `${product.name} x${product.quantity}`)
    .join("\n");

  const fechaCompra = new Date();
  const fechaCompraStr = fechaCompra.toLocaleString();

  alert(
    `Has comprado:\n${productosComprados}\n\nFecha y hora de compra: ${fechaCompraStr}\nGracias por tu compra!`
  );

  carrito = [];
  descuentoAplicado = 0;
  discountMessage.textContent = "";
  discountCodeInput.value = "";
  saveCartToLocalStorage();
  updateCartUI();
});

// Aplicar descuento
document.getElementById("apply-discount").addEventListener("click", () => {
  const codigo = discountCodeInput.value.trim();

  if (codigo === "DESCUENTO10") {
    descuentoAplicado = 10;
    discountMessage.textContent = "Código aplicado: 10% de descuento.";
    discountMessage.style.color = "green";
  } else if (codigo === "DESCUENTO20") {
    descuentoAplicado = 20;
    discountMessage.textContent = "Código aplicado: 20% de descuento.";
    discountMessage.style.color = "green";
  } else {
    descuentoAplicado = 0;
    discountMessage.textContent = "Código no válido.";
    discountMessage.style.color = "red";
  }

  updateCartUI();
});

// Renderizar productos en el carrusel
renderCarousel(productos);
updateCartUI();

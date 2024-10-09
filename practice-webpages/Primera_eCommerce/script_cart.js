function changeCartIcon() {
  const cartIcon = document.getElementById("cartIcon");
  cartIcon.innerHTML = `
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
  <path d="M13 17h-7v-14h-2" />
  <path d="M6 5l14 1l-.575 4.022m-4.925 2.978h-8.5" />
  <path d="M21 15h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
  <path d="M19 21v1m0 -8v1" />
`;
}
let carrito = [];
document.addEventListener("DOMContentLoaded", () => {
  const cartButtons = document.querySelectorAll(".add-to-cart");
  const viewCartButton = document.getElementById("view-cart");
  const modal = document.getElementById("cartModal");
  const closeModalButton = document.getElementById("closeModal");
  const cartItemsList = document.getElementById("cartItems");

  const addToCart = (product, price) => {
    const newItem = { name: product, price: price };
    carrito.push(newItem);
    calcularTotalCarrito(price);
    console.log("Contenido del carrito en JSON:", JSON.stringify(carrito));
    changeCartIcon();
  };

  cartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productName = button.parentElement
        .querySelector(".product-name")
        .textContent.trim();
      const productPrice = parseFloat(
        button.parentElement
          .querySelector(".product-price")
          .textContent.replace("€", "")
          .trim()
      );
      addToCart(productName, productPrice);
    });
  });
  const updateCartModal = () => {
    cartItemsList.innerHTML = "";
    if (carrito.length === 0) {
      cartItemsList.innerHTML = "<li>El carrito está vacío.</li>";
    } else {
      carrito.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price}€`;
        li.addEventListener("click", function () {
          var index = carrito.indexOf(item);
          if (index > -1) {
            carrito.splice(index, 1);
            updateCartModal();
            calcularTotalCarrito(-item.price);
          }
        });
        cartItemsList.appendChild(li);
      });
    }
  };

  // Abrir modal del carrito
  viewCartButton.addEventListener("click", () => {
    updateCartModal(); // Actualizar el contenido del modal
    modal.style.display = "flex"; // Mostrar el modal
    modal.classList.add("active");
  });

  // Cerrar modal
  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    modal.classList.remove("active");
  });
});

// Función para calcular el total del carrito
function calcularTotalCarrito(price) {
  let total = document.getElementById("total");
  total.textContent = (parseFloat(total.textContent) + price).toFixed(2);
}
function totalCarroBien() {
  let total = 0;
  carrito.forEach((item) => {
    total += item.price; // Asegúrate de usar item.price
  });
  document.getElementById("total").textContent = total.toFixed(2); // Actualiza el total
}

// Función para vaciar el carrito
function totalCarroVacío() {
  let total = document.getElementById("total");
  total.textContent = "0.00";
}

document.getElementById("emptyModal").addEventListener("click", function () {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  carrito = [];
  totalCarroVacío();
});

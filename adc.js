let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector(".listCart");
let iconCart = document.querySelector(".icon-cart");
let iconCartSpan = document.querySelector(".icon-cart span");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let removeItemButton = document.querySelector(".removeItem");
let products = [];
let cart = [];

// Toggle cart visibility
iconCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});

// Clear cart items from HTML and local storage
removeItemButton.addEventListener("click", function () {
  // Clear the displayed cart items
  listCartHTML.innerHTML = "";
  
  // Clear the cart data in memory
  cart = [];
  
  // Clear the cart data in local storage
  localStorage.removeItem("cart");
  
  // Reset cart item count in header
  document.querySelector(".icon-cart span").textContent = "0";
  
  // Reset total amount
  updateTotalAmount(0);
});

// Add products to the HTML
const addDataToHTML = () => {
  if (products.length > 0) {
    products.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.dataset.id = product.id;
      newProduct.classList.add("item");
      newProduct.innerHTML = `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

// Handle add to cart button click
listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addCart")) {
    let id_product = positionClick.parentElement.dataset.id;
    addToCart(id_product);
  }
});

// Add a product to the cart
const addToCart = (product_id) => {
  let positionThisProductInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (cart.length <= 0) {
    cart = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductInCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    cart[positionThisProductInCart].quantity += 1;
  }
  addCartToHTML();
  addCartToMemory();
};

// Save cart to local storage
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Update cart display
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  let totalPrice = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      let newItem = document.createElement("div");
      newItem.classList.add("item");
      newItem.dataset.id = item.product_id;

      let positionProduct = products.findIndex(
        (value) => value.id == item.product_id
      );
      let info = products[positionProduct];
      listCartHTML.appendChild(newItem);
      newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
      totalPrice += info.price * item.quantity;
    });
  }
  iconCartSpan.innerText = totalQuantity;
  updateTotalAmount(totalPrice);
};

// Update total amount display
const updateTotalAmount = (totalPrice = 0) => {
  const totalAmountElement = document.getElementById("totalAmount");
  if (totalAmountElement) {
    totalAmountElement.textContent = `The total amount is $${totalPrice.toFixed(2)}`;
  }
};

// Handle quantity change in cart
listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantityCart(product_id, type);
  }
});

// Change the quantity of a cart item
const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case "plus":
        cart[positionItemInCart].quantity += 1;
        break;

      default:
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          cart.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToHTML();
  addCartToMemory();
};

// Initialize the app
const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      addDataToHTML();
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};

// Run the initialization function
initApp();

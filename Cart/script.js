// let cart = document.getElementById("cart-items");

// let cartItem = JSON.parse(localStorage.getItem("cart"));

// cartItem.forEach((product) => {
//   const card = document.createElement("div");
//   card.classList = "card";

//   // Create card content
//   card.innerHTML = `
//     <img src=${product.thumbnail} alt="product" class="product-img">
//     <p>${product.title}</p>
//     <p>Price: ${product.price}</p>
//   `;
//   cart.append(card);
// });

const cartItemsContainer = document.getElementById("cart-items");
const cartItem = JSON.parse(localStorage.getItem("cart")) || [];

if (cartItem.length === 0) {
  cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
} else {
  cartItem.forEach((product) => {
    const card = document.createElement("div");
    card.classList = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="product" class="product-img">
      <p>${product.title}</p>
      <p>Price: ${product.price}</p>
    `;

    cartItemsContainer.append(card);
  });
}

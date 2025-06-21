const wishlist = document.getElementById("wishlist-item");
const wishlistItem = JSON.parse(sessionStorage.getItem("wishlist")) || [];

if (!wishlist) {
  console.error("No element with ID 'wishlist' found in the DOM.");
} else if (wishlistItem.length === 0) {
  wishlist.innerHTML = "<p>Your wishlist is empty.</p>";
} else {
  wishlistItem.forEach((product) => {
    const card = document.createElement("div");
    card.classList = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="product image" width="100">
      <p><strong>${product.title}</strong></p>
      <p>Price: ₹${product.price}</p>
    `;
    wishlist.appendChild(card);
  });
}

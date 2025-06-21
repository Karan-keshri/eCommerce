// Get product ID from query string
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function getSingleProduct(id) {
  const res = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await res.json();
  return data;
}

async function renderSingleProduct() {
  const product = await getSingleProduct(id);
  const container = document.getElementById("single-product");
  container.innerHTML = `
    <h2>${product.title}</h2>
    <img src="${product.thumbnail}" alt="${product.title}" />
    <p>Price: ₹${product.price}</p>
    <p>Rating: ${product.rating}</p>
    <p>${product.description}</p>
    <button>Add to cart</button>
  `;
}

renderSingleProduct();

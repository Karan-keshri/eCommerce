const cartitem=JSON.parse(localStorage.getItem('cart'))||[];
const wishitem = JSON.parse(sessionStorage.getItem("wishlist")) || [];

const cartDisplay = document.querySelector("#cart");
const wishDisplay = document.querySelector("#wish");
const offset = document.querySelector('#offset');
const paginationContainer = document.querySelector('#pagination')

const cache={};
let limit = +offset.value
let currentPage=1;

updateCartCount();
updateWishCount();

offset.addEventListener('change',()=>{
  limit = +offset.value;
  currentPage = 1;
  fetchAndRender(currentPage,limit);            
})

function generatePaginationButtons(total, limit) {
  const totalPages = Math.ceil(total / limit);
  paginationContainer.innerHTML = "";

  const maxVisibleButtons = 6;

  // Calculate the sliding window range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
  let endPage = startPage + maxVisibleButtons - 1;

  // Adjust endPage and startPage to stay within bounds
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisibleButtons + 1);
  }

  // Prev Button
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "prev";
    prevBtn.addEventListener("click", () => {
      currentPage--;
      fetchAndRender(currentPage, limit);
    });
    paginationContainer.appendChild(prevBtn);
  }

  // Page buttons
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.addEventListener("click", () => {
      currentPage = i;
      fetchAndRender(currentPage, limit);
    });
    paginationContainer.appendChild(btn);
  }

  // Next Button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "next";
    nextBtn.addEventListener("click", () => {
      currentPage++;
      fetchAndRender(currentPage, limit);
    });
    paginationContainer.appendChild(nextBtn);
  }
}


async function fetchAndRender(page, limit) {
  const skip = (page - 1) * limit;
  const { total } = await getpaginatedProduct(limit, skip);
  const products = await getpaginatedProduct(limit, skip);
  renderProducts(products);
  generatePaginationButtons(total, limit);
}

async function getSearchProducts(search) {
  const response = await fetch(`https://dummyjson.com/products/search?q=${search}`);
  const data = await response.json();
  return data;
}

async function getCategories(){
    const response = await fetch("https://dummyjson.com/products/categories")
      const data = await response.json();
      return data;
}

async function getCategorieProduct(category) {
  const response = await fetch(
    `https://dummyjson.com/products/category/${category}`
  );
  const data = await response.json();
  return data;
}

async function getAllProduct() {
  const response = await fetch("https://dummyjson.com/products/");
  const data = await response.json();
  return data;
}

async function getSingleProduct(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const data = await response.json();
  return data;
}

async function getpaginatedProduct(limit,skip) {
  const cacheKey=`${limit}-${skip}`;
  if(cache[cacheKey]){
    return cache[cacheKey]
  }
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  const data = await response.json();
  cache[cacheKey]=data
  return data;
}


let categoriesList=document.querySelector('#categories');

async function renderCategories() {
  const allCategories = await getCategories();
  allCategories.forEach(cat => {
    let div=document.createElement('div');
    // button.textContent=cat.name;
    let category=cat.slug;
    div.innerHTML = `<button onClick="getCategoriesProducts('${category}')" class="cat-btn">${cat.name}</button>
    `;
    categoriesList.append(div);
  });
}

function updateCartCount() {
  cartDisplay.textContent = `🛒 (${cartitem.length})`;
}

function updateWishCount() {
  wishDisplay.textContent = `❤️ (${wishitem.length})`;
}

function renderProducts(products) {
  const cardDiv = document.querySelector("#card");
  cardDiv.innerHTML = "";
  let count=0;
  products.products.forEach((product) => {
    count++;
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-wrapper");

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="product" class="product-img">
      <p>${product.title}</p>
      <p>Price: ₹${product.price}</p>
    `;

    card.addEventListener("click", () => singleProductDetails(product.id));

    const cartBtn = document.createElement("button");
    const isInCart = cartitem.some((item) => item.id === product.id);
    cartBtn.textContent = isInCart ? "Remove from Cart" : "Add to Cart";
    cartBtn.className = isInCart ? "cart-btn remove" : "cart-btn";

    cartBtn.addEventListener("click", () => toggleCart(product, cartBtn));

    const wishBtn = document.createElement("button");
    const isInWish = wishitem.some((item) => item.id === product.id);
    wishBtn.textContent = isInWish ? "Remove from Wishlist" : "Add to Wishlist";
    wishBtn.className = isInWish ? "wish-btn remove" : "wish-btn";

    wishBtn.addEventListener("click", () => toggleWishlist(product, wishBtn));

    wrapper.append(card, cartBtn, wishBtn);
    cardDiv.append(wrapper);
  });

  if (count === 0) {
    cardDiv.innerHTML = "No Search Found";
  }
}

function toggleCart(product, btn) {
  const index = cartitem.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    cartitem.splice(index, 1);
    btn.textContent = "Add to Cart";
    btn.className = "cart-btn";
  } else {
    cartitem.push(product);
    btn.textContent = "Remove from Cart";
    btn.className = "cart-btn remove";

  }
  localStorage.setItem("cart", JSON.stringify(cartitem));
  updateCartCount();
}

function toggleWishlist(product, btn) {
  const index = wishitem.findIndex((item) => item.id === product.id);
  if (index !== -1) {
    wishitem.splice(index, 1);
    btn.textContent = "Add to Wishlist";
    btn.className = "wish-btn";
  } else {
    wishitem.push(product);
    btn.textContent = "Remove from Wishlist";
    btn.className = "wish-btn remove";
  }
  sessionStorage.setItem("wishlist", JSON.stringify(wishitem));
  updateWishCount();
}

async function getCategoriesProducts(category){
    const products=await getCategorieProduct(category);
    renderProducts(products);
}

async function allProducts(){
const products = await getAllProduct();
renderProducts(products);
}

let debounceTimer;

document.querySelector("#search").addEventListener("input", (e) => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    const searchValue = e.target.value.trim();
    if (searchValue === "") {
      const allProducts = await getAllProduct();
      renderProducts(allProducts);
    } else {
      const searchedProducts = await getSearchProducts(searchValue);
      renderProducts(searchedProducts);
    }
  }, 1000); 
});


renderCategories()
// allProducts();

async function singleProductDetails(id) {
  const product = await getSingleProduct(id);
  let cardDiv = document.querySelector("#card");
  cardDiv.innerHTML = "";

  const isInCart = cartitem.some((item) => item.id === product.id);
  const isInWish = wishitem.some((item) => item.id === product.id);

  const card = document.createElement("div");
  card.classList = "single-product";
  card.innerHTML = `
    <img src="${product.thumbnail}" alt="product" class="product-img">
    <p>${product.title}</p>
    <p>Price: ₹${product.price}</p>
    <p>Category: ${product.category}</p>
    <p>${product.description}</p>
    <p>Rating: ${product.rating}</p>
    <p>Return policy: ${product.returnPolicy || "7 Days Return"}</p>
    <button id="add-to-cart-btn" class="cart-btn ${isInCart ? "remove" : ""}">
      ${isInCart ? "Remove from Cart" : "Add to Cart"}
    </button>
    <button id="add-to-wish-btn" class="wish-btn ${isInWish ? "remove" : ""}">
      ${isInWish ? "Remove from Wishlist" : "Add to Wishlist"}
    </button>
  `;

  cardDiv.append(card);

  const cartBtn = document.querySelector("#add-to-cart-btn");
  const wishBtn = document.querySelector("#add-to-wish-btn");

  cartBtn.addEventListener("click", () => toggleCart(product, cartBtn));
  wishBtn.addEventListener("click", () => toggleWishlist(product, wishBtn));
}


fetchAndRender(currentPage, limit);            
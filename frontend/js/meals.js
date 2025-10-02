const filterChips = document.querySelectorAll(".filter-chip")
const mealCards = document.querySelectorAll(".meal-card")
const sortSelect = document.getElementById("sortBy")
const searchInput = document.getElementById("searchInput")

// Filter by category
filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    // Remove active class from all chips
    filterChips.forEach((c) => c.classList.remove("active"))
    // Add active class to clicked chip
    chip.classList.add("active")

    const filter = chip.dataset.filter

    mealCards.forEach((card) => {
      if (filter === "all") {
        card.style.display = "block"
      } else {
        const categories = card.dataset.category
        if (categories && categories.includes(filter)) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      }
    })

    updateMealCount()
  })
})

// Sort functionality
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    const sortBy = e.target.value
    const container = document.getElementById("mealsContainer")
    const cards = Array.from(mealCards)

    cards.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseInt(a.dataset.price) - Number.parseInt(b.dataset.price)
        case "price-high":
          return Number.parseInt(b.dataset.price) - Number.parseInt(a.dataset.price)
        case "rating":
          return Number.parseFloat(b.dataset.rating) - Number.parseFloat(a.dataset.rating)
        default:
          return 0
      }
    })

    cards.forEach((card) => container.appendChild(card))
  })
}

// Search functionality
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase()

    mealCards.forEach((card) => {
      const title = card.querySelector(".meal-title").textContent.toLowerCase()
      const description = card.querySelector(".meal-description").textContent.toLowerCase()
      const chef = card.querySelector(".chef-name").textContent.toLowerCase()

      if (title.includes(searchTerm) || description.includes(searchTerm) || chef.includes(searchTerm)) {
        card.style.display = "block"
      } else {
        card.style.display = "none"
      }
    })

    updateMealCount()
  })
}

// Update meal count
function updateMealCount() {
  const visibleCards = Array.from(mealCards).filter((card) => card.style.display !== "none")
  const countElement = document.querySelector(".meal-count")
  if (countElement) {
    countElement.textContent = `(${visibleCards.length} meals)`
  }
}

// View toggle
const viewBtns = document.querySelectorAll(".view-btn")
const mealsContainer = document.getElementById("mealsContainer")

viewBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    viewBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")

    const view = btn.dataset.view
    if (view === "list") {
      mealsContainer.classList.add("list-view")
    } else {
      mealsContainer.classList.remove("list-view")
    }
  })
})

// Add to cart functionality
const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
const cartCount = document.querySelector(".cart-count")
let cartItems = 0

function showToast(message, type) {
  // Implementation of showToast function
  console.log(message, type)
}

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    cartItems++
    cartCount.textContent = cartItems
    showToast("Added to cart!", "success")

    // Add animation
    btn.textContent = "Added!"
    btn.style.backgroundColor = "var(--forest-green)"
    setTimeout(() => {
      btn.textContent = "Add to Cart"
      btn.style.backgroundColor = ""
    }, 2000)
  })
})

// Wishlist functionality
const wishlistBtns = document.querySelectorAll(".wishlist-btn")

wishlistBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation()
    btn.textContent = btn.textContent === "♡" ? "♥" : "♡"
    btn.style.color = btn.textContent === "♥" ? "var(--orange)" : ""
    showToast(btn.textContent === "♥" ? "Added to wishlist!" : "Removed from wishlist!", "success")
  })
})

// Pagination
const paginationBtns = document.querySelectorAll(".pagination-number")

paginationBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    paginationBtns.forEach((b) => b.classList.remove("active"))
    btn.classList.add("active")
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
})

console.log("[v0] Meals page loaded with", mealCards.length, "meals")

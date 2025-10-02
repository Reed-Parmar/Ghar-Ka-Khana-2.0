const thumbnails = document.querySelectorAll(".thumbnail")
const mainImage = document.getElementById("mainImage")

thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    thumbnails.forEach((t) => t.classList.remove("active"))
    thumb.classList.add("active")
    mainImage.src = thumb.src
  })
})

// Quantity controls
const decreaseBtn = document.getElementById("decreaseQty")
const increaseBtn = document.getElementById("increaseQty")
const quantityInput = document.getElementById("quantity")

if (decreaseBtn && increaseBtn && quantityInput) {
  decreaseBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value > 1) {
      quantityInput.value = value - 1
      updatePrice()
    }
  })

  increaseBtn.addEventListener("click", () => {
    const value = Number.parseInt(quantityInput.value)
    if (value < 10) {
      quantityInput.value = value + 1
      updatePrice()
    }
  })
}

function updatePrice() {
  const quantity = Number.parseInt(quantityInput.value)
  const basePrice = 120
  const totalPrice = basePrice * quantity
  const addToCartBtn = document.querySelector(".add-to-cart-btn")
  if (addToCartBtn) {
    addToCartBtn.textContent = `Add to Cart - ₹${totalPrice}`
  }
}

// Tabs functionality
const tabBtns = document.querySelectorAll(".tab-btn")
const tabContents = document.querySelectorAll(".tab-content")

tabBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.tab

    // Remove active class from all tabs and contents
    tabBtns.forEach((b) => b.classList.remove("active"))
    tabContents.forEach((c) => c.classList.remove("active"))

    // Add active class to clicked tab and corresponding content
    btn.classList.add("active")
    document.getElementById(tabId).classList.add("active")
  })
})

// Wishlist button
const wishlistBtnLarge = document.querySelector(".wishlist-btn-large")
if (wishlistBtnLarge) {
  wishlistBtnLarge.addEventListener("click", () => {
    const isWishlisted = wishlistBtnLarge.textContent.includes("♥")
    wishlistBtnLarge.textContent = isWishlisted ? "♡ Add to Wishlist" : "♥ Added to Wishlist"
    wishlistBtnLarge.style.backgroundColor = isWishlisted ? "" : "var(--orange)"
    wishlistBtnLarge.style.color = isWishlisted ? "" : "var(--white)"
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist!", "success")
  })
}

// Add to cart
const addToCartBtn = document.querySelector(".add-to-cart-btn")
const cartCount = document.querySelector(".cart-count")

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(quantityInput.value)
    let currentCount = Number.parseInt(cartCount.textContent)
    currentCount += quantity
    cartCount.textContent = currentCount

    showToast(`Added ${quantity} item(s) to cart!`, "success")

    // Animation
    addToCartBtn.textContent = "Added!"
    addToCartBtn.style.backgroundColor = "var(--forest-green)"
    setTimeout(() => {
      updatePrice()
      addToCartBtn.style.backgroundColor = ""
    }, 2000)
  })
}

// Helpful button
const helpfulBtns = document.querySelectorAll(".helpful-btn")
helpfulBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const currentText = btn.textContent
    const match = currentText.match(/$$(\d+)$$/)
    if (match) {
      const count = Number.parseInt(match[1]) + 1
      btn.textContent = currentText.replace(/$$\d+$$/, `(${count})`)
      btn.style.backgroundColor = "var(--soft-peach)"
      showToast("Thank you for your feedback!", "success")
    }
  })
})

// Declare showToast function
function showToast(message, type) {
  console.log(`[${type}] ${message}`)
}

console.log("[v0] Meal details page loaded")

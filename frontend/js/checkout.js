let cart = [
  {
    id: 1,
    name: "Rajma Chawal",
    chef: "Chef Priya's Kitchen",
    price: 60,
    quantity: 2,
    rating: 4.8,
    pickupTime: "Tomorrow, 1:00 PM",
    image: "/homemade-rajma-chawal.jpg",
  },
  {
    id: 2,
    name: "Paneer Tikka (8 pcs)",
    chef: "Aunty's Kitchen",
    price: 150,
    quantity: 1,
    rating: 4.9,
    pickupTime: "Tomorrow, 12:30 PM",
    image: "/homemade-paneer-tikka.jpg",
  },
]

// Update quantity
function updateQuantity(itemId, change) {
  const item = cart.find((i) => i.id === itemId)
  if (item) {
    item.quantity = Math.max(1, item.quantity + change)
    updateCart()
  }
}

// Remove item
function removeItem(itemId) {
  if (confirm("Are you sure you want to remove this item from your cart?")) {
    cart = cart.filter((i) => i.id !== itemId)
    updateCart()
  }
}

// Update cart display
function updateCart() {
  // Recalculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const platformFee = 10
  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + platformFee + gst

  // Update summary
  document.querySelector(".summary-row:nth-child(1) span:last-child").textContent = `₹${subtotal}`
  document.querySelector(".summary-row:nth-child(3) span:last-child").textContent = `₹${gst}`
  document.querySelector(".summary-row.total span:last-child").textContent = `₹${total}`
  document.querySelector(".summary-row:nth-child(1) span:first-child").textContent =
    `Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)`

  // Update cart count in navbar
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.querySelector(".cart-count").textContent = cartCount

  // Re-render cart items
  renderCartItems()
}

// Render cart items
function renderCartItems() {
  const cartContainer = document.querySelector(".cart-items")
  cartContainer.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-chef">by ${item.chef}</p>
                <div class="item-meta">
                    <span class="rating">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF6B35">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${item.rating}
                    </span>
                    <span class="separator">•</span>
                    <span>Pickup: ${item.pickupTime}</span>
                </div>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="item-price">
                <span class="price">₹${item.price * item.quantity}</span>
                <button class="remove-btn" onclick="removeItem(${item.id})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Set minimum date to tomorrow
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("pickup-date")
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  dateInput.min = tomorrow.toISOString().split("T")[0]
  dateInput.value = tomorrow.toISOString().split("T")[0]
})

// Apply promo code
document.querySelector(".apply-btn").addEventListener("click", () => {
  const promoInput = document.getElementById("promo-input")
  const promoCode = promoInput.value.trim().toUpperCase()

  if (promoCode === "FIRST50") {
    alert("Promo code applied! ₹50 discount added.")
    // Apply discount logic here
  } else if (promoCode === "") {
    alert("Please enter a promo code.")
  } else {
    alert("Invalid promo code. Please try again.")
  }
})

// Place order
function placeOrder() {
  // Validate form
  const pickupDate = document.getElementById("pickup-date").value
  const pickupTime = document.getElementById("pickup-time").value
  const pickupLocation = document.getElementById("pickup-location").value
  const phone = document.getElementById("phone").value
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value

  if (!pickupDate || !pickupTime || !pickupLocation || !phone) {
    alert("Please fill in all required fields.")
    return
  }

  // Validate phone number
  const phoneRegex = /^[6-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    alert("Please enter a valid 10-digit phone number.")
    return
  }

  // Create order object
  const order = {
    items: cart,
    pickup: {
      date: pickupDate,
      time: pickupTime,
      location: pickupLocation,
      phone: phone,
      instructions: document.getElementById("special-instructions").value,
    },
    payment: paymentMethod,
    total: document.querySelector(".summary-row.total span:last-child").textContent,
  }

  console.log("[v0] Order placed:", order)

  // Show success message
  alert("Order placed successfully! You will receive a confirmation shortly.")

  // Redirect to order confirmation page
  window.location.href = "order-confirmation.html"
}

// Initialize
updateCart()

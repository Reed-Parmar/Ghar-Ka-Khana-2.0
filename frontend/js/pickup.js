document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all tabs and content
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))

    // Add active class to clicked tab
    btn.classList.add("active")

    // Show corresponding content
    const tabId = btn.getAttribute("data-tab") + "-tab"
    document.getElementById(tabId).classList.add("active")
  })
})

// Confirm pickup
function confirmPickup(orderId) {
  if (confirm("Have you received your order? This will mark it as completed.")) {
    console.log("[v0] Confirming pickup for order:", orderId)
    alert("Thank you! Your order has been marked as completed. Please leave a review!")
    // Redirect to review page or update UI
    window.location.href = `../meals/meal-details.html?review=true&order=${orderId}`
  }
}

// Call chef
function callChef(phoneNumber) {
  console.log("[v0] Calling chef:", phoneNumber)
  window.location.href = `tel:${phoneNumber}`
}

// Report issue
function reportIssue(orderId) {
  const issue = prompt(
    "Please describe the issue you're facing:\n\n(e.g., Order not ready, Wrong items, Quality concerns)",
  )

  if (issue && issue.trim()) {
    console.log("[v0] Reporting issue for order:", orderId, "Issue:", issue)
    alert("Thank you for reporting. Our support team will contact you shortly to resolve this issue.")
    // Send issue report to backend
  }
}

// Cancel order
function cancelOrder(orderId) {
  const reason = prompt(
    "Please tell us why you're canceling:\n\n(e.g., Changed plans, Found alternative, Quality concerns)",
  )

  if (reason && reason.trim()) {
    if (confirm("Are you sure you want to cancel this order? Refund will be processed within 3-5 business days.")) {
      console.log("[v0] Canceling order:", orderId, "Reason:", reason)
      alert("Your order has been canceled. Refund will be processed shortly.")
      // Process cancellation
      location.reload()
    }
  }
}

// Modify order
function modifyOrder(orderId) {
  console.log("[v0] Modifying order:", orderId)
  alert("Redirecting to order modification page...")
  window.location.href = `checkout.html?modify=${orderId}`
}

// Leave review
function leaveReview(orderId) {
  console.log("[v0] Leaving review for order:", orderId)
  window.location.href = `../meals/meal-details.html?review=true&order=${orderId}`
}

// Reorder
function reorder(orderId) {
  console.log("[v0] Reordering:", orderId)
  alert("Adding items to your cart...")
  window.location.href = "checkout.html"
}

// Auto-refresh order status every 30 seconds
setInterval(() => {
  console.log("[v0] Checking for order updates...")
  // Fetch latest order status from backend
  // Update UI if status changed
}, 30000)

// Notification permission
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("[v0] Notification permission granted")
    }
  })
}

// Simulate order status notification
function showOrderNotification(orderId, status) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Ghar Ka Khana", {
      body: `Order ${orderId} is now ${status}!`,
      icon: "/logo.png",
    })
  }
}

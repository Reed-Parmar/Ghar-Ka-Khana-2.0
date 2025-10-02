const userLoginForm = document.getElementById("userLoginForm")
if (userLoginForm) {
  userLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      remember: document.querySelector('input[name="remember"]').checked,
    }

    console.log("[v0] User login attempt:", formData.email)

    // TODO: Replace with actual API call
    // const response = await fetch('/api/auth/user/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })

    // Simulate successful login
    setTimeout(() => {
      showToast("Login successful! Redirecting...", "success")
      setTimeout(() => {
        window.location.href = "../order/browse-meals.html"
      }, 1500)
    }, 1000)
  })
}

// Chef Login Form
const chefLoginForm = document.getElementById("chefLoginForm")
if (chefLoginForm) {
  chefLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      remember: document.querySelector('input[name="remember"]').checked,
    }

    console.log("[v0] Chef login attempt:", formData.email)

    // TODO: Replace with actual API call
    setTimeout(() => {
      showToast("Login successful! Redirecting to dashboard...", "success")
      setTimeout(() => {
        window.location.href = "../meals/chef-upload.html"
      }, 1500)
    }, 1000)
  })
}

// Admin Login Form
const adminLoginForm = document.getElementById("adminLoginForm")
if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      otp: document.getElementById("otp").value,
    }

    console.log("[v0] Admin login attempt:", formData.email)

    // TODO: Replace with actual API call
    setTimeout(() => {
      showToast("Admin authentication successful!", "success")
      setTimeout(() => {
        window.location.href = "../index.html" // Replace with admin dashboard
      }, 1500)
    }, 1000)
  })
}

// User Registration Form
const userRegisterForm = document.getElementById("userRegisterForm")
if (userRegisterForm) {
  userRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error")
      return
    }

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      hostel: document.getElementById("hostel").value,
      password: password,
    }

    console.log("[v0] User registration:", formData.email)

    // TODO: Replace with actual API call
    setTimeout(() => {
      showToast("Registration successful! Please check your email to verify.", "success")
      setTimeout(() => {
        window.location.href = "../login/user-login.html"
      }, 2000)
    }, 1000)
  })
}

// Chef Registration Form
const chefRegisterForm = document.getElementById("chefRegisterForm")
if (chefRegisterForm) {
  chefRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error")
      return
    }

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      studentName: document.getElementById("studentName").value,
      studentContact: document.getElementById("studentContact").value,
      address: document.getElementById("address").value,
      specialties: document.getElementById("specialties").value,
      password: password,
    }

    console.log("[v0] Chef registration:", formData.email)

    // TODO: Replace with actual API call
    setTimeout(() => {
      showToast("Registration submitted! We'll review your application and contact you within 24 hours.", "success")
      setTimeout(() => {
        window.location.href = "../index.html"
      }, 3000)
    }, 1000)
  })
}

// Admin Registration Form
const adminRegisterForm = document.getElementById("adminRegisterForm")
if (adminRegisterForm) {
  adminRegisterForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = {
      inviteCode: document.getElementById("inviteCode").value,
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    }

    console.log("[v0] Admin registration attempt")

    // TODO: Replace with actual API call
    setTimeout(() => {
      showToast("Admin account created successfully!", "success")
      setTimeout(() => {
        window.location.href = "../login/admin-login.html"
      }, 2000)
    }, 1000)
  })
}

// Password strength indicator
const passwordInputs = document.querySelectorAll('input[type="password"]')
passwordInputs.forEach((input) => {
  if (input.id === "password") {
    input.addEventListener("input", (e) => {
      const password = e.target.value
      const strength = calculatePasswordStrength(password)
      console.log("[v0] Password strength:", strength)
    })
  }
})

function calculatePasswordStrength(password) {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z\d]/.test(password)) strength++

  return strength
}

// Toast notification function (reuse from main.js if needed)
function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: ${type === "success" ? "#2D6A4F" : "#C1121F"};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease"
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Real-time email validation
const emailInputs = document.querySelectorAll('input[type="email"]')
emailInputs.forEach((input) => {
  input.addEventListener("blur", (e) => {
    const email = e.target.value
    if (email && !validateEmail(email)) {
      e.target.style.borderColor = "#C1121F"
      showToast("Please enter a valid email address", "error")
    } else {
      e.target.style.borderColor = ""
    }
  })
})

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Phone number validation
const phoneInputs = document.querySelectorAll('input[type="tel"]')
phoneInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10)
  })
})

// Enhanced Authentication with Backend Integration
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // User Login Form
        const userLoginForm = document.getElementById("userLoginForm");
        if (userLoginForm) {
            userLoginForm.addEventListener("submit", (e) => this.handleUserLogin(e));
        }

        // Chef Login Form
        const chefLoginForm = document.getElementById("chefLoginForm");
        if (chefLoginForm) {
            chefLoginForm.addEventListener("submit", (e) => this.handleChefLogin(e));
        }

        // User Registration Form
        const userRegisterForm = document.getElementById("userRegisterForm");
        if (userRegisterForm) {
            userRegisterForm.addEventListener("submit", (e) => this.handleUserRegistration(e));
        }

        // Chef Registration Form
        const chefRegisterForm = document.getElementById("chefRegisterForm");
        if (chefRegisterForm) {
            chefRegisterForm.addEventListener("submit", (e) => this.handleChefRegistration(e));
        }

        // Password validation
        this.setupPasswordValidation();
        
        // Email validation
        this.setupEmailValidation();
        
        // Phone validation
        this.setupPhoneValidation();
    }

    // Handle user login
    async handleUserLogin(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        try {
            showLoadingState("Logging in...");
            const response = await window.api.loginUser(formData.email, formData.password);
            
            if (response.token) {
                showToast("Login successful! Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = "../order/browse-meals.html";
                }, 1500);
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            showToast("Login failed. Please check your credentials.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Handle chef login
    async handleChefLogin(e) {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        try {
            showLoadingState("Logging in...");
            const response = await window.api.loginChef(formData.email, formData.password);
            
            if (response.token) {
                showToast("Login successful! Redirecting to dashboard...", "success");
                setTimeout(() => {
                    window.location.href = "../meals/chef-upload.html";
                }, 1500);
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            console.error("Chef login error:", error);
            showToast("Login failed. Please check your credentials.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Handle user registration
    async handleUserRegistration(e) {
        e.preventDefault();
        
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            return;
        }

        const formData = {
            name: document.getElementById("firstName").value + " " + document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            password: password,
        };

        try {
            showLoadingState("Creating account...");
            const response = await window.api.registerUser(formData);
            
            showToast("Registration successful! Please login to continue.", "success");
            setTimeout(() => {
                window.location.href = "../login/user-login.html";
            }, 2000);
        } catch (error) {
            console.error("Registration error:", error);
            showToast("Registration failed. Please try again.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Handle chef registration
    async handleChefRegistration(e) {
        e.preventDefault();
        
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            showToast("Passwords do not match!", "error");
            return;
        }

        const formData = {
            name: document.getElementById("firstName").value + " " + document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            password: password,
        };

        try {
            showLoadingState("Creating chef account...");
            const response = await window.api.registerChef(formData);
            
            showToast("Chef registration successful! Please login to continue.", "success");
            setTimeout(() => {
                window.location.href = "../login/chef-login.html";
            }, 2000);
        } catch (error) {
            console.error("Chef registration error:", error);
            showToast("Registration failed. Please try again.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Check if user is already authenticated
    checkAuthStatus() {
        if (window.api.isAuthenticated()) {
            // User is already logged in, redirect appropriately
            const currentPath = window.location.pathname;
            if (currentPath.includes('login') || currentPath.includes('register')) {
                // Redirect to appropriate dashboard
                if (currentPath.includes('chef')) {
                    window.location.href = "../meals/chef-upload.html";
                } else {
                    window.location.href = "../order/browse-meals.html";
                }
            }
        }
    }

    // Setup password validation
    setupPasswordValidation() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach((input) => {
            if (input.id === "password") {
                input.addEventListener("input", (e) => {
                    const password = e.target.value;
                    const strength = this.calculatePasswordStrength(password);
                    this.updatePasswordStrength(strength);
                });
            }
        });
    }

    // Setup email validation
    setupEmailValidation() {
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach((input) => {
            input.addEventListener("blur", (e) => {
                const email = e.target.value;
                if (email && !this.validateEmail(email)) {
                    e.target.style.borderColor = "#C1121F";
                    showToast("Please enter a valid email address", "error");
                } else {
                    e.target.style.borderColor = "";
                }
            });
        });
    }

    // Setup phone validation
    setupPhoneValidation() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach((input) => {
            input.addEventListener("input", (e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            });
        });
    }

    // Calculate password strength
    calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;

        return strength;
    }

    // Update password strength indicator
    updatePasswordStrength(strength) {
        // You can implement a visual strength indicator here
        console.log("Password strength:", strength);
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Utility functions
function showLoadingState(message = "Loading...") {
    // Create or update loading indicator
    let loader = document.getElementById("loadingIndicator");
    if (!loader) {
        loader = document.createElement("div");
        loader.id = "loadingIndicator";
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            z-index: 10000;
        `;
        document.body.appendChild(loader);
    }
    loader.textContent = message;
}

function hideLoadingState() {
    const loader = document.getElementById("loadingIndicator");
    if (loader) {
        loader.remove();
    }
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
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
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

console.log("[v0] Authentication system loaded with backend integration");
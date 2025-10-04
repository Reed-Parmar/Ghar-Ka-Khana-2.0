// Chef Upload Page with Backend Integration
class ChefUploadManager {
    constructor() {
        this.chefId = null;
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupImageUpload();
        this.setupComponentManagement();
        this.setupPriceCalculation();
    }

    // Check if chef is authenticated
    async checkAuthentication() {
        try {
            if (!window.api.isAuthenticated()) {
                showToast("Please login to access chef dashboard", "error");
                setTimeout(() => {
                    window.location.href = "../login/chef-login.html";
                }, 2000);
                return;
            }

            const user = await window.api.getCurrentUser();
            if (user.role !== 'CHEF') {
                showToast("Access denied. Chef account required.", "error");
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 2000);
                return;
            }

            // Get chef ID from user data (you might need to modify the API to return user ID)
            this.chefId = 1; // This should come from the authenticated user data
        } catch (error) {
            console.error("Authentication check failed:", error);
            showToast("Authentication failed. Please login again.", "error");
            setTimeout(() => {
                window.location.href = "../login/chef-login.html";
            }, 2000);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        const form = document.getElementById("mealUploadForm");
        if (form) {
            form.addEventListener("submit", (e) => this.handleMealUpload(e));
        }

        // Set default date to tomorrow
        const dateInput = document.getElementById("availableDate");
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }

        // Set default pickup times
        const startTime = document.getElementById("pickupTimeStart");
        const endTime = document.getElementById("pickupTimeEnd");
        if (startTime) startTime.value = "12:00";
        if (endTime) endTime.value = "14:00";
    }

    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById("mealUploadForm");
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const isValid = value.length > 0;

        if (isValid) {
            field.style.borderColor = "#2D6A4F";
        } else {
            field.style.borderColor = "#C1121F";
        }

        return isValid;
    }

    // Setup image upload
    setupImageUpload() {
        const uploadArea = document.getElementById("imageUploadArea");
        const fileInput = document.getElementById("mealImages");
        const previewContainer = document.getElementById("imagePreviewContainer");

        if (!uploadArea || !fileInput || !previewContainer) return;

        // Click to upload
        uploadArea.addEventListener("click", () => fileInput.click());

        // Drag and drop
        uploadArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadArea.classList.add("drag-over");
        });

        uploadArea.addEventListener("dragleave", () => {
            uploadArea.classList.remove("drag-over");
        });

        uploadArea.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadArea.classList.remove("drag-over");
            const files = Array.from(e.dataTransfer.files);
            this.handleImageFiles(files);
        });

        // File input change
        fileInput.addEventListener("change", (e) => {
            const files = Array.from(e.target.files);
            this.handleImageFiles(files);
        });
    }

    // Handle image files
    handleImageFiles(files) {
        const previewContainer = document.getElementById("imagePreviewContainer");
        if (!previewContainer) return;

        // Clear existing previews
        previewContainer.innerHTML = "";

        files.slice(0, 4).forEach((file, index) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.createElement("div");
                    preview.className = "image-preview";
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="remove-image" data-index="${index}">×</button>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Setup component management
    setupComponentManagement() {
        const addComponentBtn = document.getElementById("addComponent");
        const componentsContainer = document.getElementById("componentsContainer");

        if (addComponentBtn && componentsContainer) {
            addComponentBtn.addEventListener("click", () => this.addComponent());
        }

        // Remove component functionality
        componentsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-component")) {
                this.removeComponent(e.target);
            }
        });
    }

    // Add component
    addComponent() {
        const container = document.getElementById("componentsContainer");
        const componentDiv = document.createElement("div");
        componentDiv.className = "component-item";
        componentDiv.innerHTML = `
            <input type="text" name="component[]" placeholder="e.g., Rice (200g)" required>
            <button type="button" class="btn-icon remove-component">✕</button>
        `;
        container.appendChild(componentDiv);

        // Enable remove buttons if more than one component
        this.updateComponentButtons();
    }

    // Remove component
    removeComponent(button) {
        button.parentElement.remove();
        this.updateComponentButtons();
    }

    // Update component buttons
    updateComponentButtons() {
        const components = document.querySelectorAll(".component-item");
        const removeButtons = document.querySelectorAll(".remove-component");
        
        removeButtons.forEach(btn => {
            btn.disabled = components.length <= 1;
        });
    }

    // Setup price calculation
    setupPriceCalculation() {
        const priceInput = document.getElementById("price");
        const chefEarningSpan = document.getElementById("chefEarning");

        if (priceInput && chefEarningSpan) {
            priceInput.addEventListener("input", () => {
                const price = parseFloat(priceInput.value) || 0;
                const commission = 0.1; // 10% commission
                const earning = price * (1 - commission);
                chefEarningSpan.textContent = earning.toFixed(0);
            });
        }
    }

    // Handle meal upload
    async handleMealUpload(e) {
        e.preventDefault();

        try {
            showLoadingState("Uploading meal...");

            const formData = this.collectFormData();
            const response = await window.api.uploadMeal(formData);

            showToast("Meal uploaded successfully!", "success");
            setTimeout(() => {
                window.location.href = "#my-meals"; // Redirect to meals list
            }, 1500);

        } catch (error) {
            console.error("Meal upload failed:", error);
            showToast("Failed to upload meal. Please try again.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Collect form data
    collectFormData() {
        const form = document.getElementById("mealUploadForm");
        const formData = new FormData(form);

        // Get basic meal data
        const mealData = {
            mealName: formData.get("mealName"),
            description: formData.get("description"),
            price: parseFloat(formData.get("price")),
            availableTime: formData.get("mealType"), // Using mealType as availableTime
            imageUrl: this.getImageUrl(), // You'll need to implement image upload
            chef: { id: this.chefId } // This should be set from authenticated user
        };

        return mealData;
    }

    // Get image URL (placeholder implementation)
    getImageUrl() {
        // In a real implementation, you would upload images to a server
        // and return the URL. For now, return a placeholder.
        return "/placeholder.svg?height=240&width=400";
    }
}

// Utility functions
function showLoadingState(message = "Loading...") {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChefUploadManager();
});

console.log("[v0] Chef upload page loaded with backend integration");
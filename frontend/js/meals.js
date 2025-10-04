// Enhanced Meals Page with Backend Integration
class MealsPage {
    constructor() {
        this.meals = [];
        this.filteredMeals = [];
        this.currentFilter = 'all';
        this.currentSort = 'popular';
        this.cartItems = [];
        
        this.init();
    }

    async init() {
        await this.loadMeals();
        this.setupEventListeners();
        this.renderMeals();
    }

    // Load meals from backend API
    async loadMeals() {
        try {
            showLoadingState();
            this.meals = await window.api.getAllMeals();
            this.filteredMeals = [...this.meals];
            console.log('Loaded meals:', this.meals);
        } catch (error) {
            console.error('Failed to load meals:', error);
            showToast('Failed to load meals. Please try again.', 'error');
            // Fallback to static data if API fails
            this.meals = this.getStaticMeals();
            this.filteredMeals = [...this.meals];
        } finally {
            hideLoadingState();
        }
    }

    // Fallback static data
    getStaticMeals() {
        return [
            {
                id: 1,
                mealName: "Paneer Butter Masala",
                description: "Creamy paneer curry with butter naan and jeera rice. Made with fresh ingredients.",
                price: 120,
                imageUrl: "../picture/paneer_bt_ms.jpeg",
                availableTime: "Lunch",
                chef: { name: "Priya's Mom" },
                category: "veg north-indian",
                rating: 4.9
            },
            {
                id: 2,
                mealName: "Chicken Biryani",
                description: "Aromatic basmati rice layered with tender chicken, served with raita and salad.",
                price: 150,
                imageUrl: "../picture/biryani.jpeg",
                availableTime: "Lunch",
                chef: { name: "Rahul's Mom" },
                category: "non-veg north-indian",
                rating: 5.0
            },
            {
                id: 3,
                mealName: "Dal Tadka Thali",
                description: "Complete meal with dal tadka, 3 rotis, rice, sabzi, and pickle.",
                price: 100,
                imageUrl: "../picture/dal_tad.jpeg",
                availableTime: "Lunch",
                chef: { name: "Anjali's Mom" },
                category: "veg north-indian",
                rating: 4.8
            }
        ];
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter chips
        document.querySelectorAll(".filter-chip").forEach((chip) => {
            chip.addEventListener("click", (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById("sortBy");
        if (sortSelect) {
            sortSelect.addEventListener("change", (e) => {
                this.handleSort(e.target.value);
            });
        }

        // Search input
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // View toggle
        document.querySelectorAll(".view-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.handleViewToggle(e.target.dataset.view);
            });
        });
    }

    // Handle filter changes
    handleFilter(filter) {
        // Update active chip
        document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
        
        this.currentFilter = filter;
        this.applyFilters();
    }

    // Handle sort changes
    handleSort(sortBy) {
        this.currentSort = sortBy;
        this.applyFilters();
    }

    // Handle search
    handleSearch(searchTerm) {
        this.searchTerm = searchTerm.toLowerCase();
        this.applyFilters();
    }

    // Handle view toggle
    handleViewToggle(view) {
        document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
        document.querySelector(`[data-view="${view}"]`).classList.add("active");
        
        const container = document.getElementById("mealsContainer");
        if (view === "list") {
            container.classList.add("list-view");
        } else {
            container.classList.remove("list-view");
        }
    }

    // Apply all filters and sorting
    applyFilters() {
        let filtered = [...this.meals];

        // Apply category filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(meal => 
                meal.category && meal.category.includes(this.currentFilter)
            );
        }

        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(meal =>
                meal.mealName.toLowerCase().includes(this.searchTerm) ||
                meal.description.toLowerCase().includes(this.searchTerm) ||
                (meal.chef && meal.chef.name.toLowerCase().includes(this.searchTerm))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case "price-low":
                    return a.price - b.price;
                case "price-high":
                    return b.price - a.price;
                case "rating":
                    return (b.rating || 0) - (a.rating || 0);
                case "newest":
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                default:
                    return 0;
            }
        });

        this.filteredMeals = filtered;
        this.renderMeals();
    }

    // Render meals to the page
    renderMeals() {
        const container = document.getElementById("mealsContainer");
        if (!container) return;

        // Update meal count
        const countElement = document.querySelector(".meal-count");
        if (countElement) {
            countElement.textContent = `(${this.filteredMeals.length} meals)`;
        }

        // Clear existing content
        container.innerHTML = '';

        // Render meal cards
        this.filteredMeals.forEach(meal => {
            const mealCard = this.createMealCard(meal);
            container.appendChild(mealCard);
        });

        // Setup event listeners for new cards
        this.setupCardEventListeners();
    }

    // Create a meal card element
    createMealCard(meal) {
        const card = document.createElement('div');
        card.className = 'meal-card';
        card.dataset.mealId = meal.id;
        card.dataset.category = meal.category || '';
        card.dataset.price = meal.price;
        card.dataset.rating = meal.rating || 0;

        const isVeg = meal.category && meal.category.includes('veg');
        const badgeClass = isVeg ? 'badge-veg' : 'badge-non-veg';
        const badgeText = isVeg ? 'Veg' : 'Non-Veg';

        card.innerHTML = `
            <div class="meal-image-container">
                <img src="${meal.imageUrl || '/placeholder.svg?height=240&width=400'}" 
                     alt="${meal.mealName}" class="meal-image">
                <span class="meal-badge ${badgeClass}">
                    <span class="badge-icon"></span>
                    ${badgeText}
                </span>
                <button class="wishlist-btn">♡</button>
            </div>
            <div class="meal-content">
                <div class="meal-header">
                    <h3 class="meal-title">${meal.mealName}</h3>
                    <span class="meal-price">₹${meal.price}</span>
                </div>
                <p class="meal-description">${meal.description}</p>
                <div class="meal-tags">
                    <span class="tag">${meal.availableTime || 'Lunch'}</span>
                    <span class="tag">Serves 1</span>
                </div>
                <div class="meal-meta">
                    <div class="chef-info">
                        <img src="/placeholder.svg?height=32&width=32" alt="Chef" class="chef-avatar">
                        <span class="chef-name">${meal.chef ? meal.chef.name : 'Unknown Chef'}</span>
                    </div>
                    <div class="meal-rating">
                        <span class="star">★</span>
                        <span class="rating-text">${meal.rating || 0}</span>
                    </div>
                </div>
                <div class="meal-actions">
                    <button class="btn btn-outline view-details-btn" 
                            onclick="window.location.href='../meals/meal-details.html?id=${meal.id}'">
                        View Details
                    </button>
                    <button class="btn btn-primary add-to-cart-btn" data-meal-id="${meal.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Setup event listeners for meal cards
    setupCardEventListeners() {
        // Add to cart buttons
        document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.addToCart(e.target.dataset.mealId);
            });
        });

        // Wishlist buttons
        document.querySelectorAll(".wishlist-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleWishlist(btn);
            });
        });
    }

    // Add item to cart
    addToCart(mealId) {
        const meal = this.meals.find(m => m.id == mealId);
        if (!meal) return;

        this.cartItems.push(meal);
        this.updateCartCount();
        showToast("Added to cart!", "success");

        // Update button state
        const btn = document.querySelector(`[data-meal-id="${mealId}"]`);
        if (btn) {
            btn.textContent = "Added!";
            btn.style.backgroundColor = "var(--forest-green)";
            setTimeout(() => {
                btn.textContent = "Add to Cart";
                btn.style.backgroundColor = "";
            }, 2000);
        }
    }

    // Toggle wishlist
    toggleWishlist(btn) {
        btn.textContent = btn.textContent === "♡" ? "♥" : "♡";
        btn.style.color = btn.textContent === "♥" ? "var(--orange)" : "";
        showToast(btn.textContent === "♥" ? "Added to wishlist!" : "Removed from wishlist!", "success");
    }

    // Update cart count
    updateCartCount() {
        const cartCount = document.querySelector(".cart-count");
        if (cartCount) {
            cartCount.textContent = this.cartItems.length;
        }
    }
}

// Utility functions
function showLoadingState() {
    const container = document.getElementById("mealsContainer");
    if (container) {
        container.innerHTML = '<div class="loading">Loading meals...</div>';
    }
}

function hideLoadingState() {
    // Loading state will be replaced by actual content
}

function showToast(message, type = "success") {
    // Use the existing toast function from main.js
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        console.log(message, type);
    }
}

// Initialize the meals page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MealsPage();
});

console.log("[v0] Meals page loaded with backend integration");
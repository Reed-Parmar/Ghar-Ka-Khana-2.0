// Order Management System with Backend Integration
class OrderManager {
    constructor() {
        this.orders = [];
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        await this.loadOrders();
        this.setupEventListeners();
        this.renderOrders();
    }

    // Check authentication
    async checkAuthentication() {
        try {
            if (!window.api.isAuthenticated()) {
                showToast("Please login to view orders", "error");
                setTimeout(() => {
                    window.location.href = "../login/user-login.html";
                }, 2000);
                return;
            }

            this.currentUser = await window.api.getCurrentUser();
        } catch (error) {
            console.error("Authentication check failed:", error);
            showToast("Authentication failed. Please login again.", "error");
            setTimeout(() => {
                window.location.href = "../login/user-login.html";
            }, 2000);
        }
    }

    // Load orders from backend
    async loadOrders() {
        try {
            showLoadingState("Loading orders...");
            
            if (this.currentUser.role === 'CHEF') {
                this.orders = await window.api.getChefOrders(this.currentUser.id);
            } else {
                this.orders = await window.api.getUserOrders(this.currentUser.id);
            }
            
            console.log('Loaded orders:', this.orders);
        } catch (error) {
            console.error('Failed to load orders:', error);
            showToast('Failed to load orders. Please try again.', 'error');
            // Fallback to empty array
            this.orders = [];
        } finally {
            hideLoadingState();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Status update buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('status-btn')) {
                this.handleStatusUpdate(e.target);
            }
        });
    }

    // Handle filter changes
    handleFilter(filter) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Filter orders
        let filteredOrders = [...this.orders];
        
        if (filter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === filter);
        }

        this.renderOrders(filteredOrders);
    }

    // Handle status update
    async handleStatusUpdate(button) {
        const orderId = button.dataset.orderId;
        const newStatus = button.dataset.status;

        try {
            showLoadingState("Updating order status...");
            
            // Update order status (you'll need to implement this API endpoint)
            await this.updateOrderStatus(orderId, newStatus);
            
            // Update local orders
            const order = this.orders.find(o => o.id == orderId);
            if (order) {
                order.status = newStatus;
            }
            
            showToast("Order status updated successfully!", "success");
            this.renderOrders();
            
        } catch (error) {
            console.error("Failed to update order status:", error);
            showToast("Failed to update order status. Please try again.", "error");
        } finally {
            hideLoadingState();
        }
    }

    // Update order status (placeholder - you'll need to implement this API endpoint)
    async updateOrderStatus(orderId, status) {
        // This would be a PUT request to /orders/{orderId}/status
        // For now, just simulate the update
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }

    // Render orders
    renderOrders(ordersToRender = null) {
        const orders = ordersToRender || this.orders;
        const container = document.getElementById('ordersContainer');
        
        if (!container) return;

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h3>No orders found</h3>
                    <p>You don't have any orders yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => this.createOrderCard(order)).join('');
    }

    // Create order card
    createOrderCard(order) {
        const isChef = this.currentUser.role === 'CHEF';
        const statusClass = this.getStatusClass(order.status);
        const statusText = this.getStatusText(order.status);

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.id}</h3>
                        <span class="order-date">${this.formatDate(order.createdAt)}</span>
                    </div>
                    <div class="order-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>

                <div class="order-details">
                    <div class="meal-info">
                        <img src="${order.meal?.imageUrl || '/placeholder.svg?height=60&width=60'}" 
                             alt="${order.meal?.mealName || 'Meal'}" class="meal-thumb">
                        <div class="meal-details">
                            <h4>${order.meal?.mealName || 'Unknown Meal'}</h4>
                            <p>by ${order.meal?.chef?.name || 'Unknown Chef'}</p>
                            <span class="quantity">Qty: ${order.quantity}</span>
                        </div>
                    </div>

                    <div class="order-meta">
                        <div class="meta-item">
                            <span class="meta-label">Total Amount:</span>
                            <span class="meta-value">₹${order.meal?.price * order.quantity || 0}</span>
                        </div>
                        ${isChef ? `
                            <div class="meta-item">
                                <span class="meta-label">Customer:</span>
                                <span class="meta-value">${order.user?.name || 'Unknown User'}</span>
                            </div>
                        ` : `
                            <div class="meta-item">
                                <span class="meta-label">Chef:</span>
                                <span class="meta-value">${order.meal?.chef?.name || 'Unknown Chef'}</span>
                            </div>
                        `}
                    </div>
                </div>

                ${isChef ? this.createChefActions(order) : this.createUserActions(order)}
            </div>
        `;
    }

    // Create chef actions
    createChefActions(order) {
        const actions = [];
        
        if (order.status === 'Placed') {
            actions.push(`
                <button class="btn btn-primary status-btn" 
                        data-order-id="${order.id}" 
                        data-status="Confirmed">
                    Confirm Order
                </button>
            `);
        }
        
        if (order.status === 'Confirmed') {
            actions.push(`
                <button class="btn btn-primary status-btn" 
                        data-order-id="${order.id}" 
                        data-status="Preparing">
                    Start Preparing
                </button>
            `);
        }
        
        if (order.status === 'Preparing') {
            actions.push(`
                <button class="btn btn-primary status-btn" 
                        data-order-id="${order.id}" 
                        data-status="Ready">
                    Mark as Ready
                </button>
            `);
        }

        return `
            <div class="order-actions">
                ${actions.join('')}
                <button class="btn btn-outline" onclick="this.viewOrderDetails(${order.id})">
                    View Details
                </button>
            </div>
        `;
    }

    // Create user actions
    createUserActions(order) {
        return `
            <div class="order-actions">
                <button class="btn btn-outline" onclick="this.viewOrderDetails(${order.id})">
                    View Details
                </button>
                ${order.status === 'Placed' ? `
                    <button class="btn btn-secondary status-btn" 
                            data-order-id="${order.id}" 
                            data-status="Cancelled">
                        Cancel Order
                    </button>
                ` : ''}
            </div>
        `;
    }

    // Get status class
    getStatusClass(status) {
        const statusClasses = {
            'Placed': 'status-placed',
            'Confirmed': 'status-confirmed',
            'Preparing': 'status-preparing',
            'Ready': 'status-ready',
            'Completed': 'status-completed',
            'Cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-placed';
    }

    // Get status text
    getStatusText(status) {
        const statusTexts = {
            'Placed': 'Order Placed',
            'Confirmed': 'Confirmed',
            'Preparing': 'Preparing',
            'Ready': 'Ready for Pickup',
            'Completed': 'Completed',
            'Cancelled': 'Cancelled'
        };
        return statusTexts[status] || status;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // View order details
    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id == orderId);
        if (order) {
            // You can implement a modal or redirect to details page
            console.log('Order details:', order);
            showToast('Order details feature coming soon!', 'info');
        }
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
        background: ${type === "success" ? "#2D6A4F" : type === "error" ? "#C1121F" : "#3B82F6"};
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
    new OrderManager();
});

console.log("[v0] Order management system loaded with backend integration");

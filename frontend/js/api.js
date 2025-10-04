// API Service Layer for Ghar Ka Khana Frontend
class GharKaKhanaAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.token = localStorage.getItem('authToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    // Clear authentication token
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // User Authentication
    async registerUser(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'USER'
            })
        });
    }

    async loginUser(email, password) {
        const response = await this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    // Chef Authentication
    async registerChef(chefData) {
        return this.request('/chefs/register', {
            method: 'POST',
            body: JSON.stringify({
                name: chefData.name,
                email: chefData.email,
                password: chefData.password,
                role: 'CHEF'
            })
        });
    }

    async loginChef(email, password) {
        const response = await this.request('/chefs/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            this.setToken(response.token);
        }
        
        return response;
    }

    // Meals API
    async getAllMeals() {
        return this.request('/meals/all');
    }

    async getMealsByChef(chefId) {
        return this.request(`/meals/chef/${chefId}`);
    }

    async uploadMeal(mealData) {
        return this.request('/meals/upload', {
            method: 'POST',
            body: JSON.stringify(mealData)
        });
    }

    // Orders API
    async placeOrder(orderData) {
        return this.request('/orders/place', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getUserOrders(userId) {
        return this.request(`/orders/user/${userId}`);
    }

    async getChefOrders(chefId) {
        return this.request(`/orders/chef/${chefId}`);
    }

    // User Management
    async getCurrentUser() {
        if (!this.token) {
            throw new Error('No authentication token found');
        }
        
        // Decode JWT token to get user info (basic implementation)
        try {
            const payload = JSON.parse(atob(this.token.split('.')[1]));
            return {
                email: payload.sub,
                role: payload.role
            };
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    // Utility methods
    isAuthenticated() {
        return !!this.token;
    }

    logout() {
        this.clearToken();
        window.location.href = '/frontend/index.html';
    }
}

// Create global API instance
window.api = new GharKaKhanaAPI();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GharKaKhanaAPI;
}

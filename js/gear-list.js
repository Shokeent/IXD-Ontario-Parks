// Gear List JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initGearList();
});

function initGearList() {
    // Initialize filter functionality
    initCategoryFilters();
    
    // Initialize gear item interactions
    initGearItems();
    
    // Initialize checklist functionality if available
    initGearChecklist();
    
    // Initialize search functionality
    initGearSearch();
    
    // Load saved gear list state
    loadGearListState();
}

// Category Filter Functionality
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const gearCategories = document.querySelectorAll('.gear-category');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter categories
            filterCategories(category, gearCategories);
            
            // Save filter state
            localStorage.setItem('selectedGearCategory', category);
        });
    });
}

function filterCategories(selectedCategory, categories) {
    categories.forEach(category => {
        const categoryId = category.id;
        
        if (selectedCategory === 'all') {
            category.style.display = 'block';
            animateIn(category);
        } else {
            // Convert category ID to match filter data-category
            const categoryMatch = categoryId.replace('-', '');
            
            if (categoryMatch === selectedCategory || categoryId.includes(selectedCategory)) {
                category.style.display = 'block';
                animateIn(category);
            } else {
                animateOut(category);
            }
        }
    });
}

function animateIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 50);
}

function animateOut(element) {
    element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

// Gear Item Interactions
function initGearItems() {
    const gearItems = document.querySelectorAll('.gear-item');
    
    gearItems.forEach(item => {
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Add click functionality for detailed view
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on checkbox
            if (e.target.classList.contains('gear-checkbox')) {
                return;
            }
            
            showGearDetails(this);
        });
    });
}

function showGearDetails(gearItem) {
    const gearName = gearItem.querySelector('h3').textContent;
    const gearDescription = gearItem.querySelector('.gear-description').textContent;
    
    // Create modal for gear details
    const modal = createGearModal(gearName, gearDescription);
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function createGearModal(name, description) {
    const modal = document.createElement('div');
    modal.className = 'gear-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${name}</h2>
                    <button class="close-btn" onclick="closeGearModal(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="gear-image-large placeholder-gear">
                        <div class="gear-placeholder-icon">📷</div>
                    </div>
                    <p class="gear-description-full">${description}</p>
                    <div class="gear-details">
                        <h4>Recommended Specifications:</h4>
                        <ul>
                            <li>Suitable for beginners to intermediate users</li>
                            <li>Weather-resistant and durable construction</li>
                            <li>Lightweight and portable design</li>
                            <li>Available at most outdoor equipment stores</li>
                        </ul>
                    </div>
                    <div class="gear-tips">
                        <h4>Pro Tips:</h4>
                        <ul>
                            <li>Test your gear before your trip</li>
                            <li>Check local regulations if applicable</li>
                            <li>Consider renting before purchasing</li>
                            <li>Ask park staff for recommendations</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" onclick="closeGearModal(this)">Close</button>
                    <button class="btn-primary" onclick="addToChecklist('${name}')">Add to My List</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    if (!document.getElementById('gear-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'gear-modal-styles';
        styles.textContent = `
            .gear-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s, visibility 0.3s;
            }
            
            .gear-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                background: rgba(0, 0, 0, 0.5);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px 24px 0;
                border-bottom: 1px solid #e5e7eb;
                margin-bottom: 24px;
            }
            
            .modal-header h2 {
                margin: 0;
                color: #1f2937;
                font-size: 24px;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 28px;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            
            .close-btn:hover {
                color: #374151;
            }
            
            .modal-body {
                padding: 0 24px 24px;
            }
            
            .gear-image-large {
                width: 100%;
                height: 200px;
                margin-bottom: 20px;
                border-radius: 8px;
            }
            
            .gear-description-full {
                font-size: 16px;
                line-height: 1.6;
                color: #374151;
                margin-bottom: 20px;
            }
            
            .gear-details, .gear-tips {
                margin-bottom: 20px;
            }
            
            .gear-details h4, .gear-tips h4 {
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                margin: 0 0 8px;
            }
            
            .gear-details ul, .gear-tips ul {
                margin: 0;
                padding-left: 20px;
                color: #374151;
            }
            
            .gear-details li, .gear-tips li {
                margin-bottom: 4px;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .modal-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                padding: 24px;
                border-top: 1px solid #e5e7eb;
            }
            
            @media (max-width: 480px) {
                .modal-content {
                    margin: 10px;
                    max-height: calc(100vh - 20px);
                }
                
                .modal-header, .modal-body, .modal-actions {
                    padding-left: 16px;
                    padding-right: 16px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    return modal;
}

function closeGearModal(button) {
    const modal = button.closest('.gear-modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.remove();
    }, 300);
}

// Gear Checklist Functionality
function initGearChecklist() {
    // Add checkboxes to gear items
    const gearItems = document.querySelectorAll('.gear-item');
    
    gearItems.forEach(item => {
        if (!item.querySelector('.gear-checkbox')) {
            const checkbox = document.createElement('div');
            checkbox.className = 'gear-checkbox';
            checkbox.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleGearItem(this, item);
            });
            
            item.querySelector('.gear-image').appendChild(checkbox);
        }
    });
}

function toggleGearItem(checkbox, gearItem) {
    const gearName = gearItem.querySelector('h3').textContent;
    const isChecked = checkbox.classList.contains('checked');
    
    if (isChecked) {
        checkbox.classList.remove('checked');
        removeFromChecklist(gearName);
    } else {
        checkbox.classList.add('checked');
        addToChecklist(gearName);
    }
    
    // Save checklist state
    saveChecklistState();
}

function addToChecklist(gearName) {
    let checklist = getChecklist();
    if (!checklist.includes(gearName)) {
        checklist.push(gearName);
        localStorage.setItem('gearChecklist', JSON.stringify(checklist));
        
        // Show success message
        showToast(`${gearName} added to your gear list!`, 'success');
    }
}

function removeFromChecklist(gearName) {
    let checklist = getChecklist();
    const index = checklist.indexOf(gearName);
    if (index > -1) {
        checklist.splice(index, 1);
        localStorage.setItem('gearChecklist', JSON.stringify(checklist));
        
        // Show success message
        showToast(`${gearName} removed from your gear list!`, 'info');
    }
}

function getChecklist() {
    const saved = localStorage.getItem('gearChecklist');
    return saved ? JSON.parse(saved) : [];
}

function saveChecklistState() {
    const checkedItems = document.querySelectorAll('.gear-checkbox.checked');
    const checklist = Array.from(checkedItems).map(checkbox => {
        const gearItem = checkbox.closest('.gear-item');
        return gearItem.querySelector('h3').textContent;
    });
    
    localStorage.setItem('gearChecklist', JSON.stringify(checklist));
}

function loadGearListState() {
    // Load saved category filter
    const savedCategory = localStorage.getItem('selectedGearCategory');
    if (savedCategory) {
        const filterButton = document.querySelector(`[data-category="${savedCategory}"]`);
        if (filterButton) {
            filterButton.click();
        }
    }
    
    // Load saved checklist
    const checklist = getChecklist();
    checklist.forEach(gearName => {
        const gearItems = document.querySelectorAll('.gear-item');
        gearItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent;
            if (itemName === gearName) {
                const checkbox = item.querySelector('.gear-checkbox');
                if (checkbox) {
                    checkbox.classList.add('checked');
                }
            }
        });
    });
}

// Search Functionality
function initGearSearch() {
    // Create search box if it doesn't exist
    const container = document.querySelector('.gear-categories .container');
    const existingSearch = container.querySelector('.gear-search');
    
    if (!existingSearch) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'gear-search';
        searchContainer.innerHTML = `
            <div class="search-icon">🔍</div>
            <input type="text" placeholder="Search gear items..." id="gearSearchInput">
        `;
        
        container.insertBefore(searchContainer, container.querySelector('.category-filters'));
        
        // Add search functionality
        const searchInput = document.getElementById('gearSearchInput');
        searchInput.addEventListener('input', function() {
            searchGearItems(this.value);
        });
    }
}

function searchGearItems(searchTerm) {
    const gearItems = document.querySelectorAll('.gear-item');
    const categories = document.querySelectorAll('.gear-category');
    
    if (!searchTerm.trim()) {
        // Show all items and categories
        gearItems.forEach(item => item.style.display = 'block');
        categories.forEach(category => category.style.display = 'block');
        return;
    }
    
    const term = searchTerm.toLowerCase();
    
    categories.forEach(category => {
        const categoryItems = category.querySelectorAll('.gear-item');
        let hasVisibleItems = false;
        
        categoryItems.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.gear-description').textContent.toLowerCase();
            
            if (name.includes(term) || description.includes(term)) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide category based on whether it has visible items
        category.style.display = hasVisibleItems ? 'block' : 'none';
    });
}

// Toast Notification System
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.gear-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `gear-toast gear-toast-${type}`;
    toast.textContent = message;
    
    // Add toast styles if not already added
    if (!document.getElementById('toast-styles')) {
        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            .gear-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1f2937;
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                font-size: 14px;
                font-weight: 500;
                opacity: 0;
                transform: translateX(100%);
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .gear-toast.gear-toast-success {
                background: #10b981;
            }
            
            .gear-toast.gear-toast-info {
                background: #3b82f6;
            }
            
            .gear-toast.show {
                opacity: 1;
                transform: translateX(0);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Export checklist functionality
function exportChecklist() {
    const checklist = getChecklist();
    
    if (checklist.length === 0) {
        showToast('Your gear list is empty!', 'info');
        return;
    }
    
    const checklistText = `Ontario Parks Gear Checklist\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${checklist.map(item => `☐ ${item}`).join('\n')}\n\nHappy camping!`;
    
    // Create downloadable file
    const blob = new Blob([checklistText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ontario-parks-gear-checklist.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Gear checklist downloaded!', 'success');
}

// See All functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('see-all-btn')) {
        const category = e.target.closest('.gear-category');
        const categoryId = category.id;
        
        // Toggle expanded view
        const gearGrid = category.querySelector('.gear-grid');
        const isExpanded = category.classList.contains('expanded');
        
        if (isExpanded) {
            category.classList.remove('expanded');
            e.target.textContent = 'See all';
            // Show only first 4 items
            const items = gearGrid.querySelectorAll('.gear-item');
            items.forEach((item, index) => {
                item.style.display = index < 4 ? 'block' : 'none';
            });
        } else {
            category.classList.add('expanded');
            e.target.textContent = 'See less';
            // Show all items
            const items = gearGrid.querySelectorAll('.gear-item');
            items.forEach(item => {
                item.style.display = 'block';
            });
        }
    }
});

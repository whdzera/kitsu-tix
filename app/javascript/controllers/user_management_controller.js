// user_management_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["table", "search", "filter", "loadMore"]
  
  search() {
    this.filterTable()
  }
  
  filterRole() {
    this.filterTable()
  }
  
  filterTable() {
    const searchText = this.searchTarget.value.toLowerCase()
    const roleFilter = this.filterTarget.value.toLowerCase()
    
    this.tableTarget.querySelectorAll("tbody tr").forEach(row => {
      const username = row.cells[0].textContent.toLowerCase()
      const email = row.cells[1].textContent.toLowerCase()
      const role = row.cells[2].textContent.toLowerCase()
      
      const matchesSearch = username.includes(searchText) || email.includes(searchText)
      const matchesRole = !roleFilter || role.includes(roleFilter)
      
      row.style.display = (matchesSearch && matchesRole) ? '' : 'none'
    })
  }
  
  loadMore(event) {
    const btn = this.loadMoreTarget
    const currentPage = parseInt(btn.dataset.page)
    const nextPage = currentPage + 1
    
    // Show loading indicator
    btn.innerHTML = 'Loading...'
    btn.disabled = true
    
    fetch(`${btn.dataset.path}?page=${nextPage}&format=json`)
      .then(response => response.json())
      .then(data => {
        if (data.users?.length > 0) {
          const currentUserId = parseInt(btn.dataset.currentUserId)
          const tbody = this.tableTarget.querySelector('tbody')
          
          data.users.forEach(user => {
            const row = document.createElement('tr')
            row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700'
            row.innerHTML = this.createUserRowHtml(user, currentUserId)
            tbody.appendChild(row)
          })
          
          // Update page number
          btn.dataset.page = nextPage
          
          // Hide button if all users loaded
          if (nextPage * 10 >= parseInt(btn.dataset.total)) {
            btn.style.display = 'none'
          } else {
            // Reset button state
            btn.innerHTML = 'Load More Users'
            btn.disabled = false
          }
          
          // Apply any active filters to the new rows
          this.filterTable()
        } else {
          // No more users to load
          btn.style.display = 'none'
        }
      })
      .catch(error => {
        console.error('Error loading users:', error)
        // Reset button state on error
        btn.innerHTML = 'Load More Users'
        btn.disabled = false
      })
  }
  
  createUserRowHtml(user, currentUserId) {
    const date = new Date(user.created_at)
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
    
    // Get CSRF token for form submission
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    
    let actionButtons = ''
    
    // Edit button - consistent with Tailwind styling
    const editButton = `
      <a href="/admin/users/${user.id}/edit" class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </a>
    `
    
    // Current user badge or delete button
    let deleteOrCurrentTag = ''
    
    if (user.id !== currentUserId) {
      // Delete button for other users
      deleteOrCurrentTag = `
        <form action="/admin/users/${user.id}" method="post" style="display: inline-block;">
          <input type="hidden" name="authenticity_token" value="${csrfToken}">
          <input type="hidden" name="_method" value="delete">
          <button type="submit" 
                 class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                 onclick="return confirm('Are you sure you want to update?')">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </form>
      `
    } else {
      // Current user badge
      deleteOrCurrentTag = `
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          Current
        </span>
      `
    }
    
    actionButtons = `
      <div class="flex space-x-2">
        ${editButton}
        ${deleteOrCurrentTag}
      </div>
    `
    
    // Full user row HTML
    return `
      <td class="px-4 py-3 whitespace-nowrap">${user.username}</td>
      <td class="px-4 py-3 whitespace-nowrap">${user.email}</td>
      <td class="px-4 py-3 whitespace-nowrap">${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
      <td class="px-4 py-3 whitespace-nowrap">${formattedDate}</td>
      <td class="px-4 py-3 whitespace-nowrap">${actionButtons}</td>
    `
  }
}
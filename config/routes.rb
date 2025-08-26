Rails.application.routes.draw do
  # Devise routes for users
  devise_for :users,
             controllers: {
               registrations: "users/registrations",
               confirmations: "users/confirmations"
             }

  # Homepage
  root to: "home#index"

  # Static pages
  get "/confirmation_instructions",
      to: "static_pages#confirmation_instructions",
      as: :confirmation_instructions
  get "/tos", to: "static_pages#terms_conditions", as: :terms_conditions
  get "/privacy", to: "static_pages#privacy_policy", as: :privacy_policy
  get "/faq", to: "static_pages#faq", as: :faq
  get "/contact", to: "static_pages#contact", as: :contact
  get "/about", to: "static_pages#about", as: :about

  # Admin area
  namespace :admin do
    get "dashboard", to: "dashboard#index"
    get "users/:id/edit", to: "dashboard#edit_user", as: "edit_user"
    patch "users/:id", to: "dashboard#update_user", as: "update_user"
    delete "users/:id", to: "dashboard#delete_user", as: "delete_user"
  end

  # Member area
  namespace :member do
    get "dashboard", to: "dashboard#index"
  end
end

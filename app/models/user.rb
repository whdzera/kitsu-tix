class User < ApplicationRecord
  # Include default devise modules
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable,
  :confirmable,
  authentication_keys: [:login]
         
  # Virtual attribute for login (username or email)
  attr_accessor :login
  
  # Define roles
  ROLES = %w[member admin].freeze
  
  # Validations
  validates :username, presence: true, uniqueness: true, 
  format: { with: /\A[\w\-]+\z/, message: "only allows letters, numbers, and underscores without spaces" },
  length: { minimum: 6, message: "must be at least 6 characters long" }
  
  validates :email, presence: true, uniqueness: { case_sensitive: false }, 
  format: { without: /\+/, message: "must not contain '+'" }

  
  # Role methods
  def admin?
    role == 'admin'
  end
  
  def member?
    role == 'member'
  end
  
  # Set default role for new users
  after_initialize :set_default_role, if: :new_record?
  
  # Method to find user by username or email
  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if (login = conditions.delete(:login))
      where(conditions.to_h).where(["lower(username) = :value OR lower(email) = :value", 
        { value: login.downcase }]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      where(conditions.to_h).first
    end
  end
  
  private
  
  def set_default_role
    self.role ||= 'member'
  end
end
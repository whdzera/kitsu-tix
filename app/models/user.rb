class User < ApplicationRecord
  # Include default devise modules
  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         :validatable,
         :confirmable

  # Define roles
  ROLES = %w[superadmin organizer user].freeze

  # Validations
  validates :email,
            presence: true,
            uniqueness: {
              case_sensitive: false
            },
            format: {
              without: /\+/,
              message: "must not contain '+'"
            }

  # Role methods
  def superadmin?
    role == "superadmin"
  end

  def organizer?
    role == "organizer"
  end

  def user?
    role == "user"
  end

  # Set default role for new users
  after_initialize :set_default_role, if: :new_record?

  private

  def set_default_role
    self.role ||= "user"
  end
end

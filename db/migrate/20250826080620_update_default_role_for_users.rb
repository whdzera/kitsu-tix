class UpdateDefaultRoleForUsers < ActiveRecord::Migration[8.0]
  def up
    # Change default for new rows
    change_column_default :users, :role, from: "member", to: "user"

    # Update existing rows
    execute <<-SQL
      UPDATE users SET role = 'user' WHERE role = 'member';
    SQL
  end

  def down
    change_column_default :users, :role, from: "user", to: "member"
  end
end

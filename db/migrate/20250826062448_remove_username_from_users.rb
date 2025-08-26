class RemoveUsernameFromUsers < ActiveRecord::Migration[8.0]
  def change
    remove_index :users, :username if index_exists?(:users, :username)
    remove_column :users, :username, :string
  end
end

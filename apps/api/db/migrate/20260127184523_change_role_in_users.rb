class ChangeRoleInUsers < ActiveRecord::Migration[8.1]
  def up
    change_column :users, :role, :string, default: "user"
  end

  def down
    change_column :users, :role, :integer, default: 0, using: 'CASE role WHEN \'admin\' THEN 1 ELSE 0 END'
  end
end

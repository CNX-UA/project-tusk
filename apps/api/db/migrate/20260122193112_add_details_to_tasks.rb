class AddDetailsToTasks < ActiveRecord::Migration[8.1]
  def change
    add_column :tasks, :position, :integer
    add_column :tasks, :deadline, :datetime
  end
end

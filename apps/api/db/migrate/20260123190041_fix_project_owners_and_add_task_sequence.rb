class FixProjectOwnersAndAddTaskSequence < ActiveRecord::Migration[8.1]
  def change
    change_column_null :projects, :user_id, true
    change_column_null :projects, :team_id, true

    add_column :tasks, :sequence_id, :integer, default:0, null:false

    add_index :tasks, [:project_id, :sequence_id], unique: true
  end
end

class CreateTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.text :description
      t.string :status
      t.string :priority
      t.datetime :due_date
      t.references :project, null: false, foreign_key: true
      t.bigint :assignee_id
      t.bigint :creator_id
      t.bigint :parent_task_id

      t.timestamps
    end
    add_foreign_key :tasks, :users, column: :assignee_id
    add_foreign_key :tasks, :users, column: :creator_id
    add_foreign_key :tasks, :tasks, column: :parent_task_id

    add_index :tasks, :assignee_id
    add_index :tasks, :creator_id
    add_index :tasks, :parent_task_id
  end
end

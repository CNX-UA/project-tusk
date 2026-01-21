class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :title
      t.string :key
      t.string :status
      t.references :team, null: false, foreign_key: true

      t.timestamps
    end
    add_index :projects, :key, unique: true
  end
end

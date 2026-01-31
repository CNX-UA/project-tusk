class AddParentIdToProjects < ActiveRecord::Migration[8.1]
  def change
    add_reference :projects, :parent, 
                  null: true, 
                  foreign_key: { to_table: :projects }, 
                  index: true
  end
end

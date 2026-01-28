class MigrateEnumsToStringsToInts < ActiveRecord::Migration[8.1]
  def up
    rename_column :projects, :status, :status_old
    add_column :projects, :status, :integer, default: 0
    execute "UPDATE projects SET status = 0 WHERE status_old = 'active'"
    execute "UPDATE projects SET status = 1 WHERE status_old = 'archived'"
    execute "UPDATE projects SET status = 2 WHERE status_old = 'completed'"
    remove_column :projects, :status_old

    rename_column :tasks, :priority, :priority_old
    add_column :tasks, :priority, :integer, default: 1 # default to medium
    execute "UPDATE tasks SET priority = 0 WHERE priority_old = 'low'"
    execute "UPDATE tasks SET priority = 1 WHERE priority_old = 'medium'"
    execute "UPDATE tasks SET priority = 2 WHERE priority_old = 'high'"
    execute "UPDATE tasks SET priority = 3 WHERE priority_old = 'urgent'"
    remove_column :tasks, :priority_old

    rename_column :tasks, :status, :status_old
    add_column :tasks, :status, :integer, default: 0
    execute "UPDATE tasks SET status = 0 WHERE status_old = 'todo'"
    execute "UPDATE tasks SET status = 1 WHERE status_old = 'in_progress'"
    execute "UPDATE tasks SET status = 2 WHERE status_old = 'review'"
    execute "UPDATE tasks SET status = 3 WHERE status_old = 'done'"
    remove_column :tasks, :status_old

    rename_column :teams, :department_type, :department_type_old
    add_column :teams, :department_type, :integer, default: 0
    execute "UPDATE teams SET department_type = 0 WHERE department_type_old = 'general'"
    execute "UPDATE teams SET department_type = 1 WHERE department_type_old = 'it'"
    execute "UPDATE teams SET department_type = 2 WHERE department_type_old = 'marketing'"
    execute "UPDATE teams SET department_type = 3 WHERE department_type_old = 'sales'"
    execute "UPDATE teams SET department_type = 4 WHERE department_type_old = 'hr'"
    remove_column :teams, :department_type_old

    [:team_memberships, :users].each do |table|
      rename_column table, :role, :role_old
      add_column table, :role, :integer, default: 0
      execute "UPDATE #{table} SET role = 0 WHERE role_old IN ('member', 'user')"
      execute "UPDATE #{table} SET role = 1 WHERE role_old IN ('manager', 'admin')"
      remove_column table, :role_old
    end
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end

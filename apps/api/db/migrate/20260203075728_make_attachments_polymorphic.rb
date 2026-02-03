class MakeAttachmentsPolymorphic < ActiveRecord::Migration[7.1]
  def change
    rename_column :attachments, :task_id, :attachable_id
    add_column :attachments, :attachable_type, :string
    reversible do |dir|
      dir.up { execute "UPDATE attachments SET attachable_type = 'Task'" }
    end
    add_index :attachments, [:attachable_type, :attachable_id]
  end
end
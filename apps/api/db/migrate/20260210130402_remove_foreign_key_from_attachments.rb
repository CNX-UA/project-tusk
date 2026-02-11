class RemoveForeignKeyFromAttachments < ActiveRecord::Migration[8.0]
  def change
    remove_foreign_key :attachments, column: :attachable_id
  end
end
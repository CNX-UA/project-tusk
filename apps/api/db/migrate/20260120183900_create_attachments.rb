class CreateAttachments < ActiveRecord::Migration[8.1]
  def change
    create_table :attachments do |t|
      t.string :file_url
      t.string :file_type
      t.references :task, null: false, foreign_key: true
      t.bigint :uploader_id

      t.timestamps
    end
    add_foreign_key :attachments, :users, column: :uploader_id

    add_index :attachments, :uploader_id
  end
end

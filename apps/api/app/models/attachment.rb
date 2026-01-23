class Attachment < ApplicationRecord
  belongs_to :task
  belongs_to :uploader, class_name: "User"

  validates :file_url, presence: true
  validates :file_type, presence: true
end

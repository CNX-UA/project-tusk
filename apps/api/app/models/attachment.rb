class Attachment < ApplicationRecord
  belongs_to :task
  belongs_to :uploader, class_name: 'User'
end

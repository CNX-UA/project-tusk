class Comment < ApplicationRecord
  belongs_to :task
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1000 }

  has_many :attachments, as: :attachable, dependent: :destroy
end

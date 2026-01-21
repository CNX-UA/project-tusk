class Project < ApplicationRecord
  belongs_to :team
  has_many :tasks, dependent: :destroy

  validates :title, presence: true
  validates :key, presence: true, uniqueness: true, length: { maximum: 10 }
end

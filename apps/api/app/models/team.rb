class Team < ApplicationRecord
  has_many :team_memberships, dependent: :destroy
  has_many :users, through: :team_memberships
  has_many :projects, dependent: :destroy

  validates :name, presence: true

  enum :department_type, { 
    general: 0, 
    it: 1, 
    marketing: 2, 
    sales: 3,
    hr: 4 
  }, default: :general
end

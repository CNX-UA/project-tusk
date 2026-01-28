class Project < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :team, optional: true

  has_many :tasks, dependent: :destroy

  validates :title, presence: true

  validate :must_have_owner
  
  before_validation :generate_key, on: :create

  enum :status, { 
    active: 0, 
    archived: 1, 
    completed: 2 
  }, default: :active

  private
  def generate_key
    return if title.blank? || key.present?
    base_key = title.parameterize.split("-").map(&:first).join.upcase[0..2]
    base_key = "PRJ" if base_key.length < 2

    self.key = base_key
    counter = 1

    while Project.exists?(key: self.key)
      self.key = "#{base_key}#{counter}"
      counter += 1
    end
  end
  
  def must_have_owner
    if user_id.blank? && team_id.blank?
      errors.add(:base, "Project must belong to either a User or a Team")
    end
    if user_id.present? && team_id.present?
      errors.add(:base, "Project cannot belong to both User and Team at the same time")
    end
  end
end

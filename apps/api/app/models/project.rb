class Project < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :team, optional: true

  has_many :tasks, dependent: :destroy

  validates :title, presence: true

  validate :must_have_owner
  
  before_validation :generate_key, on: :create

  private
  def generate_key
    return if title.blank?
    self.key ||= title.parameterize.split("-").map(&:first).join.upcase[0..2]
    self.key = "PRJ" if self.key.blank?
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

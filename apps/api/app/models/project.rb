class Project < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :team, optional: true

  has_many :tasks, dependent: :destroy
  has_many :attachments, as: :attachable, dependent: :destroy

  belongs_to :parent_project, class_name: "Project", foreign_key: "parent_id", optional: true
  has_many :subprojects, class_name: "Project", foreign_key: "parent_id", dependent: :destroy

  validate :depth_limit

  validate :exclusive_content_type

  validates :title, presence: true

  validates :description, length: { maximum: 2000 }, allow_blank: true
  
  validate :must_have_owner
  
  validate :parent_is_not_a_board

  before_validation :generate_key, on: :create

  enum :status, { 
    active: 0, 
    archived: 1, 
    completed: 2 
  }, default: :active

  before_validation :inherit_parent_context, if: -> {parent_id.present?}

  private

  def inherit_parent_context
    return unless parent_project
    self.team_id = parent_project.team_id
    self.user_id = parent_project.user_id
  end

  def depth_limit
    return unless parent_id.present?
    
    level = 1
    current_parent = parent_project
    
    while current_parent
      level += 1
      current_parent = current_parent.parent_project
      
      if level > 6
        errors.add(:base, "Project nesting is too deep (maximum 6 levels allowed)")
        break
      end
    end
  end

  def exclusive_content_type
    if tasks.exists? && subprojects.exists?
      errors.add(:base, "A project can contain either tasks or subprojects, but not both")
    end
  end

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

  def parent_is_not_a_board
    return unless parent_project
      if parent_project.tasks.exists?
      errors.add(:base, "Cannot add sub-projects to a Board project (it already contains tasks)")
      end
  end
end

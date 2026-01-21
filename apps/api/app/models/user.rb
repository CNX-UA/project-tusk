class User < ApplicationRecord
  has_secure_password

  has_many :team_memberships
  has_many :teams, through: :team_memberships

  has_many :created_tasks, class_name: "Task", foreign_key: "creator_id"

  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignee_id"

  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}
end

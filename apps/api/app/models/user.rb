class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  before_create :generate_jti

  def generate_jti
    self.jti ||= SecureRandom.uuid
  end
  
  has_many :team_memberships
  has_many :teams, through: :team_memberships

  has_many :created_tasks, class_name: "Task", foreign_key: "creator_id"

  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignee_id"

  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}
end

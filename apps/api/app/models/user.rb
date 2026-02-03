class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, :omniauthable,
         jwt_revocation_strategy: self,
         omniauth_providers: [:google_oauth2, :github]

  before_create :generate_jti

  def generate_jti
    self.jti ||= SecureRandom.uuid
  end
  
  has_many :team_memberships
  has_many :teams, through: :team_memberships
 
  has_many :projects, dependent: :destroy
  has_many :team_projects, through: :teams, source: :projects

  has_many :comments, dependent: :destroy
  has_many :attachments, foreign_key: :uploader_id, dependent: :destroy

  has_many :created_tasks, class_name: "Task", foreign_key: "creator_id"

  has_many :assigned_tasks, class_name: "Task", foreign_key: "assignee_id"

  validates :email, presence: true, uniqueness: true, format: {with: URI::MailTo::EMAIL_REGEXP}

  enum :role, { user: 0, admin: 1 }, default: :user

  def self.from_omniauth(auth)
  where(email: auth.info.email).first_or_create do |user|
    user.password = Devise.friendly_token[0,20]
    user.provider = auth.provider
    user.uid = auth.uid
    
    user.first_name = auth.info.first_name
    user.last_name = auth.info.last_name
    
    if user.first_name.blank?
      name_parts = auth.info.name.to_s.split(' ')
      user.first_name = name_parts.first
      user.last_name = name_parts.last if name_parts.size > 1
    end
  end
  end

  def update_refresh_token!
    token = SecureRandom.base58(64)
    update!(refresh_token: token)
    token
  end

  def clear_refresh_token!
    update!(refresh_token: nil)
  end
end

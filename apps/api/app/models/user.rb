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
      user = where(email: auth.info.email).first_or_initialize
      user.password = Devise.friendly_token[0,20]
      user.provider = auth.provider
      user.uid = auth.uid

      user.avatar_url = auth.info.image if user.avatar_url.blank?

    if user.new_record?
      user.password = Devise.friendly_token[0, 20]
    end
    
    user.save
    user
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

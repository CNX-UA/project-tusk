class TeamMembership < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum :role, { member: "member", manager: "manager" }, default: :member

  validates :user_id, uniqueness: { scope: :team_id, message: "is already in this team" }
end

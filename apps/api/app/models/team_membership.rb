class TeamMembership < ApplicationRecord
  belongs_to :user
  belongs_to :team, counter_cache: :users_count

  enum :role, { member: 0, manager: 1 }, default: :member

  validates :user_id, uniqueness: { scope: :team_id, message: "is already in this team" }
end

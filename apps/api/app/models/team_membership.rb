class TeamMembership < ApplicationRecord
  belongs_to :user
  belongs_to :team

  enum :role, { member: 0, manager: 1 }, default: :member
end

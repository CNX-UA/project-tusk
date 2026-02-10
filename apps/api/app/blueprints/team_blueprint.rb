class TeamBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :department_type, :users_count, :created_at
  
  view :detail do
    association :projects, blueprint: ProjectBlueprint
    association :team_memberships, blueprint: TeamMembershipBlueprint, name: :members
  end
end
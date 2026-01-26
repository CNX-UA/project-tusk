class TeamBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :department_type, :users_count, :created_at

  field :members_count do |team|
    team.users.count
  end
end
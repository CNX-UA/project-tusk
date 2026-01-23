class TeamBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :department_type, :created_at

  field :members_count do |team|
    team.users.count
  end
end
class TeamBlueprint < Blueprinter::Base
  identifier :id
  fields :name, :department_type, :users_count, :created_at
end
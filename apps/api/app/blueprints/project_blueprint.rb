class ProjectBlueprint < Blueprinter::Base
  identifier :id
  fields :title, :key, :status, :created_at, :updated_at

  association :user, blueprint: UserBlueprint
  association :team, blueprint: TeamBlueprint

  view :detail do
    association :tasks, blueprint: TaskBlueprint
  end
end
class ProjectBlueprint < Blueprinter::Base
  identifier :id
  fields :title, :key, :status, :parent_id, :created_at, :updated_at

  field :is_folder do |project|
    project.subprojects.any?
  end

  association :user, blueprint: UserBlueprint
  association :team, blueprint: TeamBlueprint

  view :detail do
    association :subprojects, blueprint: ProjectBlueprint, view: :detail
    association :attachments, blueprint: AttachmentBlueprint
    association :tasks, blueprint: TaskBlueprint do |project|
      project.subprojects.present? ? [] : project.tasks
    end
  end
end
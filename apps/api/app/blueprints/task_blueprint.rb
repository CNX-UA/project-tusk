class TaskBlueprint < Blueprinter::Base
  identifier :id

  field :key do |task|
    task.key
  end

  fields :title, :status, :priority, :sequence_id, :description, :deadline, :position

  association :assignee, blueprint: UserBlueprint
  association :creator, blueprint: UserBlueprint

  view :detail do
    association :comments, blueprint: CommentBlueprint
    association :attachments, blueprint: AttachmentBlueprint
  end
end
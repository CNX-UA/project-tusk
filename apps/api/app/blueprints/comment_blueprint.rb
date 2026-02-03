class CommentBlueprint < Blueprinter::Base
  identifier :id
  fields :content, :created_at, :updated_at
  field :task_id
  field :user_id
  association :user, blueprint: UserBlueprint
  association :attachments, blueprint: AttachmentBlueprint
end
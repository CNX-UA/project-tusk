class AttachmentBlueprint < Blueprinter::Base
  identifier :id
  fields :file_url, :file_type, :created_at
  association :uploader, blueprint: UserBlueprint
end
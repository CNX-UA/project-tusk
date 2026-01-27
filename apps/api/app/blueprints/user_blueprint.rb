class UserBlueprint < Blueprinter::Base
  identifier :id
  fields :email, :role, :avatar_url
end
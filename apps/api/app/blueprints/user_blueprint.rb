class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email, :created_at

  field :role do |user|
    user.role || 'user'
  end

  field :avatar_url do |user|
    user.avatar_url if user.respond_to?(:avatar_url)
  end
end

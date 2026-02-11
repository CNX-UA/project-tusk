class UserBlueprint < Blueprinter::Base
  identifier :id

  fields :email, :first_name, :last_name, :created_at

  field :role do |user|
    user.role || 'user'
  end

  field :avatar_url do |user|
    user.avatar_url if user.respond_to?(:avatar_url)
  end

  field :full_name do |user|
    "#{user.first_name} #{user.last_name}".strip
  end
end
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json:{
        status: {code: 200, message: "Singed up successfully."},
        data: ::UserBlueprint.render_as_hash(resource)
      }
    else
      render json: {
        status: { 
          message: "Registration failed. #{resource.errors.full_messages.to_sentence}"
        }
      }, status: :unprocessable_entity
    end
  end
end
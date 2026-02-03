class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_action :authenticate_user!
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      access_token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first
      
      refresh_token = resource.update_refresh_token!
      cookies.signed[:refresh_token] = {
        value: refresh_token,
        httponly: true,
        secure: Rails.env.production?,
        expires: 1.week.from_now,
        same_site: :lax
      }

      response.set_header('Authorization', "Bearer #{access_token}")

      render json: {
        status: { code: 200, message: "Signed up and logged in successfully." },
        data: ::UserBlueprint.render_as_hash(resource),
        token: access_token
      }, status: :ok
    else
      render json: {
        status: { 
          message: "Registration failed. #{resource.errors.full_messages.to_sentence}"
        }
      }, status: :unprocessable_entity
    end
  end
end
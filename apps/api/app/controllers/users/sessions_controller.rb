class Users::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!, only: %i[create destroy]
  skip_before_action :verify_authenticity_token, only: %i[create destroy]

  respond_to :json

  private

  def respond_with(resource, _opts={})
  if resource.persisted?
    access_token = Warden::JWTAuth::UserEncoder.new.call(resource, :user, nil).first

    refresh_token = resource.update_refresh_token!

    cookies.signed[:refresh_token] = {
      value: refresh_token,
      httponly: true,
      secure: Rails.env.production?, #HTTPS in production
      expires: 1.week.from_now,
      same_site: :lax 
    }

    render json: {
      status: {code: 200, message: "Logged in successfully."},
      data: ::UserBlueprint.render_as_hash(resource),
      token: access_token
    }, status: :ok
  else
    render json: { error: "Login failed" }, status: :unauthorized
  end
  end

  def respond_to_on_destroy
      cookies.delete(:refresh_token)
      cookies.delete(:_project_tusk_session)
      cookies.delete(:session_id)
      reset_session

    if current_user
      current_user&.clear_refresh_token!
      
      render json: {
        status: {code: 200, message: "Logged out successfully."}
      }, status: :ok
    else
      render json: {
        status: {code: 200, message: "Logged out successfully (no active session found)."}
      }, status: :ok
    end
  end
end
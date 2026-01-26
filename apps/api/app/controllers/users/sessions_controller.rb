class Users::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!

  respond_to :json

  private

  def respond_with(resource, _opts={})
    refresh_token = resource.update_refresh_token!

    render json: {
      status: {code: 200, message: "Logged in successfully."},
      data: ::UserBlueprint.render_as_hash(resource),
      refresh_token: refresh_token
    }, status: :ok
  end

  def respond_to_on_destroy
    if current_user
      current_user&.clear_refresh_token!

      render json: {
        status: {code: 200, message: "Logged out successfully."}
      }, status: :ok
    else
      render json: {
        status: {code: 401, message: "Couldn't find an active session."}
      }, status: :unauthorized 
    end
  end
end
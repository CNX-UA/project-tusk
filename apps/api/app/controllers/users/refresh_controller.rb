class Users::RefreshController < ApplicationController
  skip_before_action :authenticate_user!

  def create
    refresh_token = params[:refresh_token]

    user = User.find_by(refresh_token: refresh_token)

    if user && refresh_token.present?
      access_token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first

      render json: {
        token: access_token,
        user: UserBlueprint.render_as_hash(user),
    }, status: :ok
    else
      render json: {error: "Invalid or expired refresh token"}, status: unauthorized
    end
  end
end
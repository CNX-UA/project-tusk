class Users::RefreshController < ApplicationController
  skip_before_action :authenticate_user!
  skip_before_action :verify_authenticity_token

  def create
    refresh_token = cookies.signed[:refresh_token]

    if refresh_token.blank?
      return render json: { error: "Missing refresh token" }, status: :unauthorized
    end

    user = User.find_by(refresh_token: refresh_token)

    if user && refresh_token.present?
      access_token = Warden::JWTAuth::UserEncoder.new.call(user, :user, nil).first
      new_refresh_token = user.update_refresh_token!

      set_refresh_cookie(new_refresh_token)

      render json: {
        token: access_token,
        user: UserBlueprint.render_as_hash(user),
    }, status: :ok
    else
      handle_potential_compromise(refresh_token)
    end
  end

  private

  def set_refresh_cookie(token)
    cookies.signed[:refresh_token] = {
      value: token,
      httponly: true,
      secure: Rails.env.production?,
      expires: 1.week.from_now,
      same_site: :none
    }
  end

  def handle_potential_compromise(token)
    cookies.delete(:refresh_token)

    render json: { error: "Security alert: session expired" }, status: :unauthorized
  end
end

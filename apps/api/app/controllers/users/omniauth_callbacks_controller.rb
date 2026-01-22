module Users
  class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :verify_authenticity_token, raise: false

    def google_oauth2
      handle_auth "Google"
    end

    def github
      handle_auth "Github"
    end

    private

    def handle_auth(kind)
      @user = User.from_omniauth(request.env["omniauth.auth"])

      if @user.persisted?
        token = Warden::JWTAuth::UserEncoder.new.call(@user, :user, nil).first

        #change localhost:5173 later to a proper address
        redirect_to "http://localhost:5173/auth/callback?token=#{token}", allow_other_host: true

      else
        #change localhost:5173 later to a proper address
        redirect_to "http://localhost:5173/login?error=AuthFailed", allow_other_host: true
      end
    end
  end
end
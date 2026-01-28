module Users
  class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
    skip_before_action :authenticate_user!
    
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
        refresh_token = @user.update_refresh_token!

        cookies.signed[:refresh_token] = {
          value: refresh_token,
          httponly: true,
          secure: Rails.env.production?,
          expires: 1.week.from_now
        }

        domain_url = ENV.fetch('DOMAIN_URL', 'http://localhost:5173')
        redirect_to "#{domain_url}/auth/callback?token=#{token}", allow_other_host: true

      else
        #change localhost:5173 later to a proper address
        redirect_to "#{domain_url}/login?error=AuthFailed", allow_other_host: true
      end
    end
  end
end
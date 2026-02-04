class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include ActionController::MimeResponds
  include Pundit::Authorization

  protect_from_forgery with: :exception
  
  before_action :authenticate_user!, except: [:csrf]

  respond_to :json

  after_action :set_csrf_cookie

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found


  def csrf
  render json: { authenticity_token: form_authenticity_token }
  end

  private

  def set_csrf_cookie
    cookies['XSRF-TOKEN'] = {
      value: form_authenticity_token,
      same_site: :lax,
      secure: Rails.env.production?
    }
  end
  
  def not_found
    render json: { 
      status: { code: 404, message: "Resource not found" }
    }, status: :not_found
  end
  
  def user_not_authorized
    render json: { 
      status: { code: 403, message: "You are not authorized to perform this action." }
    }, status: :forbidden
  end
end

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection
  include ActionController::MimeResponds
  include Pundit::Authorization

  protect_from_forgery with: :exception, prepend: true


  respond_to :json

  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  protect_from_forgery with: :null_session

  def csrf
    session[:init] = true

    token = form_authenticity_token

    cookies['XSRF-TOKEN'] = {
      value: token,
      same_site: :lax,
      httponly: false, 
      secure: Rails.env.production?,
      path: '/'
    }
  
    render json: { authenticity_token: token }
  end

  private
  
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

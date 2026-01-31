class ApplicationController < ActionController::API
  include ActionController::Cookies
  include Pundit::Authorization
  
  before_action :authenticate_user!
  
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  
  skip_before_action :verify_authenticity_token, raise: false

  include ActionController::MimeResponds

  respond_to :json

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

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

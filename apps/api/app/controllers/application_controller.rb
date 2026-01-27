class ApplicationController < ActionController::API
  before_action :authenticate_user!
  
  skip_before_action :verify_authenticity_token, raise: false

  include ActionController::MimeResponds

  respond_to :json
end

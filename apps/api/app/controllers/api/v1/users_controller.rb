class Api::V1::UsersController < ApplicationController
  def index
    authorize User

    @users = policy_scope(User)

    render json: ::UserBlueprint.render(@users), status: :ok
  end
end

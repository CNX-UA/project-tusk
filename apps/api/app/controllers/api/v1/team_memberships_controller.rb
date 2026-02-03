module Api
  module V1
    class TeamMembershipsController < ApplicationController
      before_action :set_team
      before_action :set_membership, only: %i[destroy]
      before_action :authorize_membership, only: %i[destroy]
      
      def index
        authorize @team.team_memberships.build

        @memberships = @team.team_memberships.includes(:user).order(role: :desc)
        render json: TeamMembershipBlueprint.render(@memberships)
      end

      def create
        user_to_add = User.find_by(email: params[:email])

        if user_to_add.nil?
          return render json: { error: "User with this email not found" }, status: :not_found
        end

        if @team.team_memberships.exists?(user_id: user_to_add.id)
           return render json: { error: "User is already in the team" }, status: :conflict
        end

        @membership = @team.team_memberships.build(user: user_to_add, role: params[:role] || :member)
        
        authorize @membership

        if @membership.save
          render json: TeamMembershipBlueprint.render(@membership), status: :created
        else
          render json: { errors: @membership.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @membership.manager? && @team.team_memberships.manager.count == 1
          return render json: { error: "Cannot remove the last manager" }, status: :forbidden
        end

        @membership.destroy
        head :no_content
      end

      private
      
      def authorize_membership
        authorize @membership
      end

      def set_team
        @team = Team.find(params[:team_id])
      end

      def set_membership
        @membership = @team.team_memberships.find(params[:id])
      end
    end
  end
end
module Api
  module V1
    class TeamsController < ApplicationController
      before_action :set_team, only: %i[show update destroy]
      before_action :authorize_team, only: %i[show update destroy]

      def index
        authorize Team 
      
        @teams = policy_scope(Team).order(name: :asc)
        
        render json: TeamBlueprint.render(@teams)
      end

      def show
        render json: TeamBlueprint.render(@team, view: :detail)
      end

      def create
        @team = Team.new(team_params)
        authorize @team

        ActiveRecord::Base.transaction do
          if @team.save
            @team.team_memberships.create!(user: current_user, role: :manager)
            
            render json: TeamBlueprint.render(@team, view: :detail), status: :created
          else
            render json: { errors: @team.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback 
          end
        end
      end

      def update
        if @team.update(team_params)
          render json: TeamBlueprint.render(@team, view: :detail)
        else
          render json: { errors: @team.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @team.destroy
        head :no_content
      end

      private

      def set_team
        @team = Team.find(params[:id])
      end

      def authorize_team
        authorize @team
      end

      def team_params
        params.require(:team).permit(:name, :department_type)
      end
    end
  end
end
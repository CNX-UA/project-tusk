module Api
  module V1
    class ProjectsController < ApplicationController
      before_action :set_project, only: %i[show, update, destroy]
      before_action :authorize_project, only: %i[show update destroy]

      def index
        @projects = policy_scope(Project).includes(:user, :team)

        @projects = @projects.where(team_id: params[:team_id]) if params[:team_id].present?

        if params[:status].present? && Project.statuses.keys.include?(params[:status])
           @projects = @projects.where(status: params[:status]) 
        end
        
        if params[:root].present?
          @projects = @projects.where(parent_id: nil)
        end

        render json: ProjectBlueprint.render(@projects)
      end

      def show
        if @project.tasks.exists?
           @project = Project.includes(tasks: [:assignee, :creator, :attachments]).find(params[:id])
        end

        render json: ProjectBlueprint.render(@project, view: :detail)
      end

      def create
        @project = Project.new(project_params)

        if @project.parent_project
           @project.team_id = @project.parent_project.team_id
           @project.user_id = @project.parent_project.user_id
        elsif @project.team_id.blank?
           @project.user = current_user
        end

        authorize @project

        if @project.save
          render json: ProjectBlueprint.render(@project, view: :detail), status: :created
        else
          render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @project.update(project_params)
          render json: ProjectBlueprint.render(@project, view: :detail)
        else
          render json: { errors: @project.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @project.destroy
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:id])
      end

      def authorize_project
        authorize @project
      end
      
      def project_params
        params.require(:project).permit(:title, :status, :team_id, :parent_id)
      end
    end
  end
end
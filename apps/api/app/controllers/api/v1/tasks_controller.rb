module Api
  module V1
    class TasksController < ApplicationController
      before_action :set_project, only: %i[index create]
      before_action :set_task, only: %i[show update destroy]
      before_action :authorize_task, only: %i[show update destroy]

      def index
        @tasks = @project.tasks.includes(:assignee, :creator, :comments)
                         .filter_by_status(params[:status])
                         .filter_by_assignee(params[:assignee_id])

        render json: TaskBlueprint.render(@tasks)
      end

      def create
        @task = @project.tasks.build(task_params)
        @task.creator = current_user

        authorize @task

        if @task.save
          render json: TaskBlueprint.render(@task, view: :detail), status: :created
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def show
        render json: TaskBlueprint.render(@task, view: :detail)
      end

      def update
        if @task.update(task_params)
          render json: TaskBlueprint.render(@task, view: :detail)
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @task.destroy
        head :no_content
      end

      private

      def authorize_task
        authorize @task
      end

      def set_project
        @project = Project.find(params[:project_id])
        authorize @project, :show? 
      end

      def set_task
        @task = Task.find(params[:id])
      end

      def task_params
        params.require(:task).permit(:title, :description, :status, :priority, :deadline, :assignee_id, :position)
      end
    end
  end
end
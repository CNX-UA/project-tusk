module Api
  module V1
    class CommentsController < ApplicationController
      before_action :set_task, only: %i[index create]
      before_action :set_comment, only: %i[destroy]
      before_action :authorize_comment, only: %i[destroy]

      def index
        authorize @task.comments.build

        @comments = @task.comments.includes(:user, :attachments).order(created_at: :desc)
        render json: CommentBlueprint.render(@comments)
      end

      def create
        @comment = @task.comments.build(comment_params)
        @comment.user = current_user

        authorize @comment

        if @comment.save
          render json: CommentBlueprint.render(@comment), status: :created
        else
          render json: { errors: @comment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @comment.destroy
        head :no_content
      end

      private

      def set_task
        @task = Task.find(params[:task_id])
      end

      def set_comment
        @comment = Comment.find(params[:id])
      end

      def authorize_comment
        authorize @comment
      end

      def comment_params
        params.require(:comment).permit(:content)
      end
    end
  end
end
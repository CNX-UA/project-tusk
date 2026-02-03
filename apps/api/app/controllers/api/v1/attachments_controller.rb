module Api
  module V1
    class AttachmentsController < ApplicationController
      before_action :set_attachable, only: %i[index create]
      before_action :set_attachment, only: %i[destroy]
      before_action :authorize_attachment, only: %i[destroy]

      def index
        authorize @attachable.attachments.build

        @attachments = @attachable.attachments.includes(:uploader).order(created_at: :desc)
        render json: AttachmentBlueprint.render(@attachments)
      end

      def create
        @attachment = @attachable.attachments.build(attachment_params)
        @attachment.uploader = current_user

        authorize @attachment

        if @attachment.save
          render json: AttachmentBlueprint.render(@attachment), status: :created
        else
          render json: { errors: @attachment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @attachment.destroy
        head :no_content
      end

      private

      def set_attachable
        if params[:task_id]
          @attachable = Task.find(params[:task_id])
        elsif params[:project_id]
          @attachable = Project.find(params[:project_id])
        elsif params[:comment_id]
          @attachable = Comment.find(params[:comment_id])
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Resource not found" }, status: :not_found
      end

      def set_attachment
        @attachment = Attachment.find(params[:id])
      end

      def authorize_attachment
        authorize @attachment
      end

      def attachment_params
        params.require(:attachment).permit(:file_name, :file_url, :file_type)
      end
    end
  end
end
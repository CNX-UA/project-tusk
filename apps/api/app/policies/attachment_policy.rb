class AttachmentPolicy < ApplicationPolicy
  def index?
    can_view_attachable?
  end

  def create?
    can_view_attachable?
  end

  def update?
    user.id == record.uploader_id || user.admin?
  end

  def destroy?
    user.id == record.uploader_id || user.admin? || can_manage_attachable?
  end

  private
  
  def can_view_attachable?
    parent = record.is_a?(Attachment) ? record.attachable : record 
    
    if parent.is_a?(Task)
      Pundit.policy!(user, parent.project).show?
    elsif parent.is_a?(Project)
      Pundit.policy!(user, parent).show?
    elsif parent.is_a?(Comment)
      Pundit.policy!(user, parent.task).show?
    end
  end

  def can_manage_attachable?
    parent = record.attachable
    
    if parent.is_a?(Task)
      Pundit.policy!(user, parent.project).update?
    elsif parent.is_a?(Project)
      Pundit.policy!(user, parent).update?
    elsif parent.is_a?(Comment)
      Pundit.policy!(user, parent.task.project).update?
    end
  end
end
class AttachmentPolicy < ApplicationPolicy
  def create?
    Pundit.policy!(user, record.task).show?
  end

  def update?
    user.id == record.uploader_id
  end

  def destroy?
    user.id == record.uploader_id || Pundit.policy!(user, record.task.project).update?
  end
end
class CommentPolicy < ApplicationPolicy
  def create?
    can_view_task?
  end

  def update?
    user.id == record.user_id
  end

  def destroy?
    user.id == record.user_id || can_manage_project?
  end

  private

  def can_view_task?
    Pundit.policy!(user, record.task).show?
  end

  def can_manage_project?
    Pundit.policy!(user, record.task.project).update?
  end
end
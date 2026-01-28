class TaskPolicy < ApplicationPolicy
  def index?
    Pundit.policy!(user, record.project).show?
  end

  def show?
    Pundit.policy!(user, record.project).show?
  end

  def create?
    Pundit.policy!(user, record.project).show?
  end

  def update?
    is_creator? || is_assignee? || can_manage_project?
  end

  def destroy?
    is_creator? || can_manage_project?
  end

  private

  def is_creator?
    record.creator_id == user.id
  end

  def is_assignee?
    record.assignee_id == user.id
  end

  def can_manage_project?
    Pundit.policy!(user, record.project).update?
  end
end
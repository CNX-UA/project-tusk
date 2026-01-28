class ProjectPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    user_has_access?
  end

  def create?
    true 
  end

  def update?
    is_owner? || is_team_manager?
  end

  def destroy?
    is_owner? || is_team_manager?
  end

  class Scope < Scope
    def resolve
      scope.left_joins(:team_memberships)
           .where("projects.user_id = :user_id OR team_memberships.user_id = :user_id", user_id: user.id)
           .distinct
    end
  end

  private

  def user_has_access?
    is_owner? || is_team_member?
  end

  def is_owner?
    record.user_id == user.id
  end

  def is_team_member?
    return false unless record.team_id
    record.team.users.exists?(user.id)
  end

  def is_team_manager?
    return false unless record.team_id
    membership = user.team_memberships.find_by(team_id: record.team_id)
    membership&.manager?
  end
end
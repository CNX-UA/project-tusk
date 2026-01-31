class ProjectPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user_id: user.id)
           .or(scope.where(team_id: user.team_ids))
    end
  end

  def index?
    true
  end

  def show?
    user_has_access?
  end

  def create?
    if record.team_id.present?
      is_team_manager?
    elsif record.user_id.present?
      is_owner?
    else
      false
    end
  end

  def update?
    is_owner? || is_team_manager?
  end

  def destroy?
    is_owner? || is_team_manager?
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
    user.team_ids.include?(record.team_id)
  end

  def is_team_manager?
    return false unless record.team_id
    membership = user.team_memberships.find_by(team_id: record.team_id)
    membership&.manager?
  end
end
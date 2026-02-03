class TeamMembershipPolicy < ApplicationPolicy
  def index?
    Pundit.policy!(user, record.team).show?
  end

  def create?
    is_manager?
  end

  def destroy?
    is_manager?
  end

  private

  def is_manager?
    user.team_memberships.exists?(team_id: record.team_id, role: 'manager')
  end
end
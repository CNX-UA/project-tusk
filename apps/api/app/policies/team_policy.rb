class TeamPolicy < ApplicationPolicy
  def show?
    is_member?
  end

  def create?
    true
  end

  def update?
    is_manager?
  end

  def destroy?
    is_manager?
  end

  class Scope < Scope
    def resolve
      user.teams
    end
  end

  private

  def is_member?
    record.users.exists?(user.id)
  end

  def is_manager?
    membership = user.team_memberships.find_by(team_id: record.id)
    membership&.manager?
  end
end
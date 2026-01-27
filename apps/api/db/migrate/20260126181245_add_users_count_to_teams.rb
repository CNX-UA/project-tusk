class AddUsersCountToTeams < ActiveRecord::Migration[8.1]
  def change
    add_column :teams, :users_count, :integer, default: 0, null: false

    reversible do |dir|
      dir.up do
        Team.find_each do |team|
          Team.reset_counters(team.id, :team_memberships)
        end
      end
    end
  end
end

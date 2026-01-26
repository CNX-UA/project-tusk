puts "Seeding database..."

Task.destroy_all
Project.destroy_all
TeamMembership.destroy_all
Team.destroy_all
User.destroy_all

puts "Cleaned up old data."

admin = User.create!(
  email: 'admin@tusk.com',
  password: 'password123',
  role: :admin
)

manager = User.create!(
  email: 'manager@tusk.com',
  password: 'password123',
  role: :user
)

dev = User.create!(
  email: 'dev@tusk.com',
  password: 'password123',
  role: :user
)

puts "Users created: admin@tusk.com, manager@tusk.com, dev@tusk.com (pass: password123)"

alpha_team = Team.create!(name: "Alpha Squad")

TeamMembership.create!(user: manager, team: alpha_team, role: :manager)

TeamMembership.create!(user: dev, team: alpha_team, role: :member)

puts "Team 'Alpha Squad' created with Manager and Member."

admin_project = Project.create!(
  title: "Admin's Secret Plans",
  description: "Top secret stuff",
  user: admin
)

team_project = Project.create!(
  title: "Tusk MVP Launch",
  description: "Tasks for the initial release",
  team: alpha_team
)

puts "Projects created."

Task.create!(
  title: "Setup Database",
  status: :done,
  priority: :high,
  project: admin_project,
  creator: manager,
  assignee: dev
)

Task.create!(
  title: "Design Frontend",
  status: :in_progress,
  priority: :medium,
  project: team_project,
  creator: manager,
  assignee: dev
)

puts "Tasks created."
puts "Seeding done!"
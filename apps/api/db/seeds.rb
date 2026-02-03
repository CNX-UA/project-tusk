puts "Starting Seeds..."

puts "Cleaning old data..."
Attachment.destroy_all
Comment.destroy_all
Task.destroy_all
Project.destroy_all
TeamMembership.destroy_all
Team.destroy_all
User.destroy_all

puts "Creating Users..."
admin = User.create!(
  email: 'admin@tusk.com', 
  password: 'password', 
  role: :admin,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
)

alice = User.create!(
  email: 'alice@tusk.com', 
  password: 'password', 
  role: :user,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice'
)

bob = User.create!(
  email: 'bob@tusk.com', 
  password: 'password', 
  role: :user,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob'
)

puts "Creating Teams..."

tech_team = Team.create!(name: "Rocket Tech", department_type: :it)

TeamMembership.create!(user: admin, team: tech_team, role: :manager)
TeamMembership.create!(user: alice, team: tech_team, role: :manager)
TeamMembership.create!(user: bob, team: tech_team, role: :member)    

sales_team = Team.create!(name: "Wolf of Wall St ", department_type: :sales)
TeamMembership.create!(user: admin, team: sales_team, role: :manager)

puts " Creating Projects..."

main_product = Project.create!(
  title: "Tusk SaaS Platform",
  team: tech_team,
  status: :active
)

backend_project = Project.create!(
  title: "Backend API (Rails)",
  parent_project: main_product,
  status: :active
)

frontend_project = Project.create!(
  title: "Frontend App (React)",
  parent_project: main_product,
  status: :in_progress
)

Project.create!(
  title: "Bob's Learning List",
  user: bob,
  status: :active
)

puts "Creating Tasks..."

t1 = Task.create!(
  title: "Setup Devise Auth",
  description: "Implement JWT and Refresh Tokens via Cookies",
  project: backend_project,
  creator: alice,
  assignee: bob,
  priority: :high,
  status: :done,
  deadline: 1.day.ago
)

t2 = Task.create!(
  title: "Implement Polymorphic Attachments",
  description: "Allow files on Projects, Tasks, and Comments",
  project: backend_project,
  creator: alice,
  assignee: alice,
  priority: :urgent,
  status: :review,
  deadline: 2.days.from_now
)

Task.create!(
  title: "Init Vite + React",
  project: frontend_project,
  creator: alice,
  assignee: bob,
  status: :in_progress,
  priority: :medium
)

puts "Adding Comments..."
c1 = Comment.create!(task: t1, user: bob, content: "Done! Tokens are now secure in httpOnly cookies.")
Comment.create!(task: t1, user: alice, content: "Great job, verified via Postman.")

puts "📎 Attaching Files..."

Attachment.create!(
  attachable: backend_project,
  uploader: alice,
  file_name: "API_Spec_v1.pdf",
  file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  file_type: "application/pdf"
)

Attachment.create!(
  attachable: t2,
  uploader: bob,
  file_name: "db_schema_diagram.png",
  file_url: "https://dummyimage.com/600x400/000/fff&text=Schema+Diagram",
  file_type: "image/png"
)

Attachment.create!(
  attachable: c1,
  uploader: bob,
  file_name: "server_logs.txt",
  file_url: "https://dummyimage.com/600x400/cccccc/000&text=Log+File",
  file_type: "text/plain"
)

puts "Seeds created successfully!"
puts "------------------------------------------------"
puts "Admin Login: admin@tusk.com / password"
puts "Alice Login: alice@tusk.com / password"
puts "Bob Login:   bob@tusk.com   / password"
puts "------------------------------------------------"
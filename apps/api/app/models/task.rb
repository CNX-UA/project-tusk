class Task < ApplicationRecord
  belongs_to :project

  belongs_to :creator, class_name: "User"
  belongs_to :assignee, class_name: "User", optional: true

  belongs_to :parent_task, class_name: "Task", optional: true
  has_many :subtasks, class_name: "Task", foreign_key: "parent_task_id", dependent: destory

  has_many :comments, dependent: :destroy
  has_many :attachments, dependent: :destroy

  validates :title, presence: true
  validates :status, inclusion: { in: %w[todo in_progress review done] }
end

class Task < ApplicationRecord
  belongs_to :project

  belongs_to :creator, class_name: "User"
  belongs_to :assignee, class_name: "User", optional: true

  belongs_to :parent_task, class_name: "Task", optional: true
  has_many :subtasks, class_name: "Task", foreign_key: "parent_task_id", dependent: :destroy

  has_many :comments, dependent: :destroy
  has_many :attachments, dependent: :destroy

  validates :title, presence: true

  default_scope { order(position: :asc) }

  enum :priority, { 
    low: 0, 
    medium: 1, 
    high: 2, 
    urgent: 3 
    }, default: :medium

  enum :status, { 
    todo: 0, 
    in_progress: 1, 
    review: 2, 
    done: 3 
  }, default: :"todo"

  after_initialize :set_default_status, if: :new_record?

  before_create :set_sequence_id

  def key
    "#{project.key}-#{sequence_id}"
  end

  private
  def set_sequence_id
    max_seq = Task.where(project_id: project_id).maximum(:sequence_id) || 0
    self.sequence_id = max_seq + 1
  end

  def set_default_status
    self.status ||= "todo"
  end
end

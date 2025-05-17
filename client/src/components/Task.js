import React, { useState, useEffect } from "react";

const Task = ({ task, moveTask, updateTask, deleteTask, isAnyTaskEditing, setEditingStatus }) => {
  const [dragging, setDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // Update editedTask whenever task prop changes
  useEffect(() => {
    setEditedTask({ ...task });
  }, [task]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isEditing) {
        handleCancelEdit();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isEditing]);

  // Update parent component with editing status
  useEffect(() => {
    if (setEditingStatus) {
      setEditingStatus(isEditing);
    }
  }, [isEditing, setEditingStatus]);

  const handleDragStart = (e) => {
    if (isAnyTaskEditing || isEditing) {
      e.preventDefault();
      return;
    }
    setDragging(true);
    e.dataTransfer.setData("taskId", task._id);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  // Format the deadline date for better display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate progress bar width based on progress percentage
  const getProgressWidth = () => {
    if (task.progress === "0%") return "0%";
    if (task.progress === "25%") return "25%";
    if (task.progress === "50%") return "50%";
    if (task.progress === "75%") return "75%";
    if (task.progress === "100%") return "100%";
    return "0%";
  };
  
  // Get color for progress bar based on status
  const getProgressColor = () => {
    if (task.status === "Completed") return "var(--completed-color)";
    if (parseInt(task.progress) >= 75) return "var(--completed-color)";
    if (parseInt(task.progress) >= 25) return "var(--progress-color)";
    return "var(--todo-color)";
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTask({ ...task }); // Reset to original task data
  };

  const handleSaveEdit = () => {
    // Validate required fields
    if (!editedTask.title || !editedTask.subject || !editedTask.deadline) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Update the task
    updateTask(task._id, editedTask);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task._id);
    }
  };

  return (
    <>
      <div
        className={`task ${dragging ? "dragging" : ""} ${isAnyTaskEditing ? "no-drag" : ""}`}
        draggable={!isAnyTaskEditing && !isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-priority={task.priority || "medium"}
      >
        <div className="task-header">
          <h4>{task.title}</h4>
          <div className="task-actions">
            <button 
              className="edit-button" 
              onClick={handleEdit} 
              title="Edit task"
              disabled={isAnyTaskEditing && !isEditing}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button 
              className="delete-button" 
              onClick={handleDelete} 
              title="Delete task"
              disabled={isAnyTaskEditing}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: getProgressWidth(),
              backgroundColor: getProgressColor()
            }}
          ></div>
        </div>
        
        <div className="task-meta">
          <div className="task-meta-item">
            <span className="meta-label">Subject</span>
            <span className="meta-value">{task.subject}</span>
          </div>
          <div className="task-meta-item">
            <span className="meta-label">Progress</span>
            <span className="meta-value">{task.progress}</span>
          </div>
          {task.priority && (
            <div className="task-meta-item">
              <span className="meta-label">Priority</span>
              <span className={`meta-value priority-${task.priority}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          )}
        </div>
        
        <div className="deadline">
          <i className="far fa-calendar-alt"></i>
          <span>{formatDate(task.deadline)}</span>
        </div>
      </div>

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Task</h3>
              <button className="close-button" onClick={handleCancelEdit}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="edit-form">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Subject <span className="required">*</span></label>
                <input
                  type="text"
                  name="subject"
                  value={editedTask.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Progress</label>
                <select
                  name="progress"
                  value={editedTask.progress}
                  onChange={handleChange}
                >
                  <option value="0%">0% (Not Started)</option>
                  <option value="25%">25% (Just Started)</option>
                  <option value="50%">50% (Half-way)</option>
                  <option value="75%">75% (Almost Done)</option>
                  <option value="100%">100% (Completed)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Deadline <span className="required">*</span></label>
                <input
                  type="date"
                  name="deadline"
                  value={editedTask.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={editedTask.priority || "medium"}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="modal-footer">
                <button onClick={handleSaveEdit} className="save-button">
                  <i className="fas fa-check"></i> Save Changes
                </button>
                <button onClick={handleCancelEdit} className="cancel-button">
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Task;

import React, { useState, useEffect } from "react";

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [progress, setProgress] = useState("0%");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Automatically expand form when page loads for better visibility
  useEffect(() => {
    setIsFormExpanded(true);
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) errors.title = "Title is required";
    if (!subject.trim()) errors.subject = "Subject is required";
    if (!deadline) errors.deadline = "Deadline is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newTask = {
      id: Date.now().toString(),
      title,
      subject,
      progress,
      deadline,
      priority,
      status: "To Do",
    };
    
    addTask(newTask);
    
    // Clear form
    setTitle("");
    setSubject("");
    setProgress("0%");
    setDeadline("");
    setPriority("medium");
    setFormErrors({});
    
    // Show success message
    const successMessage = document.getElementById("task-added-message");
    successMessage.style.opacity = "1";
    setTimeout(() => {
      successMessage.style.opacity = "0";
    }, 3000);
  };

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
  };

  return (
    <div className={`task-form-container ${isFormExpanded ? 'expanded' : ''}`}>
      <div className="task-form-header" onClick={toggleForm}>
        <h3>
          <i className={`fas ${isFormExpanded ? 'fa-minus-circle' : 'fa-plus-circle'}`}></i> 
          Create a new task
        </h3>
        <span className="toggle-hint">{isFormExpanded ? 'Click to collapse' : 'Click to expand'}</span>
      </div>
      
      <div id="task-added-message" className="success-message">
        <i className="fas fa-check-circle"></i> Task added successfully!
      </div>
        <div className="task-form-content">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-title">
                Task Title <span className="required">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={formErrors.title ? "error" : ""}
              />
              {formErrors.title && <div className="error-message">{formErrors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="task-subject">
                Subject <span className="required">*</span>
              </label>
              <input
                id="task-subject"
                type="text"
                placeholder="e.g., Project, Category, Course"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={formErrors.subject ? "error" : ""}
              />
              {formErrors.subject && <div className="error-message">{formErrors.subject}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="task-deadline">
                Deadline <span className="required">*</span>
              </label>
              <input
                id="task-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={formErrors.deadline ? "error" : ""}
              />
              {formErrors.deadline && <div className="error-message">{formErrors.deadline}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <div className="priority-selector">
                <div 
                  className={`priority-option ${priority === "low" ? "selected" : ""}`} 
                  onClick={() => setPriority("low")}
                  data-priority="low"
                >
                  <i className="fas fa-flag"></i> Low
                </div>
                <div 
                  className={`priority-option ${priority === "medium" ? "selected" : ""}`}
                  onClick={() => setPriority("medium")}
                  data-priority="medium"
                >
                  <i className="fas fa-flag"></i> Medium
                </div>
                <div 
                  className={`priority-option ${priority === "high" ? "selected" : ""}`}
                  onClick={() => setPriority("high")}
                  data-priority="high"
                >
                  <i className="fas fa-flag"></i> High
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group progress-group">
              <label htmlFor="task-progress">Initial Progress</label>
              <div className="progress-selector">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="25" 
                  value={parseInt(progress)} 
                  onChange={(e) => setProgress(`${e.target.value}%`)}
                />
                <div className="progress-labels">
                  <span className={progress === "0%" ? "active" : ""}>0%</span>
                  <span className={progress === "25%" ? "active" : ""}>25%</span>
                  <span className={progress === "50%" ? "active" : ""}>50%</span>
                  <span className={progress === "75%" ? "active" : ""}>75%</span>
                  <span className={progress === "100%" ? "active" : ""}>100%</span>
                </div>
                <div className="progress-preview">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: progress }}
                    ></div>
                  </div>
                  <span className="progress-value">{progress}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="add-task-btn">
              <i className="fas fa-plus"></i> Add Task
            </button>
            <button type="button" className="reset-btn" onClick={() => {
              setTitle("");
              setSubject("");
              setProgress("0%");
              setDeadline("");
              setPriority("medium");
              setFormErrors({});
            }}>
              <i className="fas fa-undo"></i> Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

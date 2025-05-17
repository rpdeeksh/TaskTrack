import React from "react";
import Task from "./Task";

const TaskList = ({ 
  tasks, 
  status, 
  moveTask, 
  updateTask, 
  deleteTask, 
  onColumnDrop, 
  columnClass, 
  icon, 
  isAnyTaskEditing,
  setEditingStatus 
}) => {
  const handleDragOver = (e) => {
    if (isAnyTaskEditing) return; // Disable drag when editing
    e.preventDefault();
  };

  const handleDrop = (e) => {
    if (isAnyTaskEditing) return; // Disable drop when editing
    e.preventDefault();
    onColumnDrop(e, status);
  };

  const filteredTasks = tasks.filter((task) => task.status === status);
  
  const getEmptyColumnMessage = () => {
    switch(status) {
      case 'To Do':
        return 'No pending tasks';
      case 'In Progress':
        return 'No tasks in progress';
      case 'Completed':
        return 'No completed tasks yet';
      default:
        return 'No tasks';
    }
  };
  
  const getEmptyColumnIcon = () => {
    switch(status) {
      case 'To Do':
        return 'fa-clipboard-list';
      case 'In Progress':
        return 'fa-hourglass-half';
      case 'Completed':
        return 'fa-check-double';
      default:
        return 'fa-clipboard';
    }
  };

  return (
    <div 
      className={`column ${columnClass} ${isAnyTaskEditing ? 'editing-mode' : ''}`} 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <h2><i className={`fas ${icon}`}></i> {status}</h2>
      {filteredTasks.length === 0 ? (
        <div className="empty-column">
          <i className={`fas ${getEmptyColumnIcon()}`}></i>
          <p>{getEmptyColumnMessage()}</p>
          {status === 'To Do' && (
            <p>Add new tasks above</p>
          )}
        </div>
      ) : (
        filteredTasks.map((task) => (
          <Task 
            key={task._id} 
            task={task} 
            moveTask={moveTask} 
            updateTask={updateTask}
            deleteTask={deleteTask}
            isAnyTaskEditing={isAnyTaskEditing}
            setEditingStatus={setEditingStatus}
          />
        ))
      )}
    </div>
  );
};

export default TaskList;

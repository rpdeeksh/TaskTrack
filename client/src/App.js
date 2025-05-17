import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./styles.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const [isAnyTaskEditing, setIsAnyTaskEditing] = useState(false);

  // Fetch tasks from backend
  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Failed to fetch tasks", err));
  }, []);

  // Update subject filters
  useEffect(() => {
    const subjects = [...new Set(tasks.map((task) => task.subject))];
    setUniqueSubjects(subjects);
  }, [tasks]);

  const addTask = (newTask) => {
    const taskWithDefaults = {
      ...newTask,
      priority: newTask.priority || "medium",
      status: "To Do",
    };

    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskWithDefaults),
    })
      .then((res) => res.json())
      .then((saved) => setTasks((prev) => [...prev, saved]))
      .catch((err) => console.error("Failed to add task", err));
  };

  const updateTask = (taskId, updatedTask) => {
    fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? updated : t)));
      })
      .catch((err) => console.error("Failed to update task", err));
  };

  const deleteTask = (taskId) => {
    fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
      .then(() => {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
      })
      .catch((err) => console.error("Failed to delete task", err));
  };

  const moveTask = (draggedTaskId, targetId, newStatus) => {
    if (isAnyTaskEditing) return;

    const draggedTask = tasks.find((t) => t._id === draggedTaskId);
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, status: newStatus };
    updateTask(draggedTaskId, updatedTask);
  };

  const handleColumnDrop = (e, status) => {
    if (isAnyTaskEditing) return;

    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData("taskId");
    if (draggedTaskId) {
      const draggedTask = tasks.find((t) => t._id === draggedTaskId);
      if (draggedTask && draggedTask.status !== status) {
        updateTask(draggedTaskId, { ...draggedTask, status });
      }
    }
  };

  const setEditingStatus = (isEditing) => {
    setIsAnyTaskEditing(isEditing);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesSubject =
      filterSubject === "all" || task.subject === filterSubject;
    return matchesSearch && matchesPriority && matchesSubject;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterPriority("all");
    setFilterSubject("all");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo-container">
          <div className="logo">
            <i className="fas fa-tasks"></i>
          </div>
          <h1>TaskTrack</h1>
        </div>
        <p className="app-subtitle">
          Organize, Track, and Complete Your Tasks Efficiently
        </p>
      </header>

      <TaskForm addTask={addTask} />

      <div className="filters">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Priority:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {uniqueSubjects.length > 0 && (
          <div className="filter-group">
            <label>Subject:</label>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        )}

        {(searchTerm ||
          filterPriority !== "all" ||
          filterSubject !== "all") && (
          <button className="clear-filters" onClick={clearFilters}>
            <i className="fas fa-times"></i> Clear Filters
          </button>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="stats">
          <div className="stat">
            <i className="fas fa-list"></i>
            <span>Total Tasks: {totalTasks}</span>
          </div>
          <div className="stat">
            <i className="fas fa-check-circle"></i>
            <span>Completed: {completedTasks}</span>
          </div>
          <div className="stat">
            <i className="fas fa-chart-pie"></i>
            <span>Completion Rate: {completionRate}%</span>
          </div>
        </div>
      )}

      <div className="columns">
        <TaskList
          tasks={filteredTasks}
          status="To Do"
          moveTask={moveTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          onColumnDrop={handleColumnDrop}
          columnClass="todo"
          icon="fa-list-check"
          isAnyTaskEditing={isAnyTaskEditing}
          setEditingStatus={setEditingStatus}
        />
        <TaskList
          tasks={filteredTasks}
          status="In Progress"
          moveTask={moveTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          onColumnDrop={handleColumnDrop}
          columnClass="in-progress"
          icon="fa-spinner"
          isAnyTaskEditing={isAnyTaskEditing}
          setEditingStatus={setEditingStatus}
        />
        <TaskList
          tasks={filteredTasks}
          status="Completed"
          moveTask={moveTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          onColumnDrop={handleColumnDrop}
          columnClass="completed"
          icon="fa-check-circle"
          isAnyTaskEditing={isAnyTaskEditing}
          setEditingStatus={setEditingStatus}
        />
      </div>
      <footer className="app-footer">
        <p>
          Developed by <strong>Saanvi R Prabhu</strong> |
          <a
            href="mailto:saanvirprabhu@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Email
          </a>{" "}
          |
          <a
            href="https://www.linkedin.com/in/saanvi-r-prabhu-78b74328b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;

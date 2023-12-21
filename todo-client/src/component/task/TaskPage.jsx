import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./task.css"
const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editingTask, setEditingTask] = useState(null);
  
 
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchTasks();
    }
  }, [token]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: token },
      });
      setTasks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('loi lay du lieu tu server:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const handleAddTask = async () => {
    
    try {
      if(newTask.title==''||newTask.description==''){
        alert("khong duoc de trong")
        setNewTask('');
        return;
      }

     if (role === 'admin') {
        await axios.post(
          'http://localhost:5000/tasks',
          { title: newTask.title, description: newTask.description, addedBy: role },
          { headers: { Authorization: token } }
        );
        setNewTask({ title: '', description: '' });
        fetchTasks();
      } else {
        alert('ban khong co quyen them task.');
        setNewTask({ title: '', description: '' });
      }
    } catch (error) {
      console.error('loi them task:', error);
    }
  };

  const handleEditTask = async (taskId) => {
    try {
      if (role != 'admin') {
        alert('ban khong co quyen sua task.');
       
      } else {
        await axios.put(
          `http://localhost:5000/tasks/${taskId}`,
          { title: editingTask.title, description: editingTask.description },
          { headers: { Authorization: token } }
        );
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error('loi sua task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (role === 'admin') {

        await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
          headers: { Authorization: token },
        });if(window.confirm("ban chac cham muon xoa??")){
          fetchTasks();       
        }else{
          return
        };
        
      } else {
        alert('ban khong co quyen xoa task.');
      }
    } catch (error) {
      console.error('loi xoa task:', error);
    }
  };

  return (
    <div className="container">
      <h2>Task Page</h2>
      <button onClick={handleLogout} className="logout-button"> Logout </button>

      <div className="task-container">
        <h3>Task List</h3>
        
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="task">
              <div>
                <strong>Title:</strong> {task.title} ---- <strong>Description:</strong> {task.description}
              </div>
              <div className="task-actions">
                <button onClick={() => setEditingTask({ ...task })} className="edit"> Edit </button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
        

        <div>
          <h3>Add New Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button onClick={handleAddTask}>Add Task</button>
       

          {editingTask && (
            <div>
              <h3>Edit Task</h3>
              <input
                type="text"
                placeholder="Title"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={editingTask.description}
                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              />
              <button onClick={() => handleEditTask(editingTask.id)} style={{marginRight:"5px"}}> Save </button>
              <button onClick={() => setEditingTask(null)} className="cancel"> Cancel </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TaskPage
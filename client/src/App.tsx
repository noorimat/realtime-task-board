import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done';
  createdAt: number;
}

const socket: Socket = io('http://localhost:3001');

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  useEffect(() => {
    socket.on('tasks:load', (loadedTasks: Task[]) => {
      setTasks(loadedTasks);
    });

    socket.on('task:created', (task: Task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on('task:updated', (updatedTask: Task) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    socket.on('task:deleted', (taskId: string) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    });

    return () => {
      socket.off('tasks:load');
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
    };
  }, []);

  const createTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: Omit<Task, 'id'> = {
      title: newTaskTitle,
      description: newTaskDesc,
      status: 'todo',
      createdAt: Date.now()
    };

    socket.emit('task:create', task);
    setNewTaskTitle('');
    setNewTaskDesc('');
  };

  const updateStatus = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      socket.emit('task:update', { ...task, status: newStatus });
    }
  };

  const deleteTask = (taskId: string) => {
    socket.emit('task:delete', taskId);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(t => t.status === status);
  };

  return (
    <div className="container">
      <h1 className="header">Real-Time Task Board</h1>
      
      <div className="form-card">
        <h2 className="form-title">Create New Task</h2>
        <form onSubmit={createTask}>
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Task description..."
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            className="textarea-field"
            rows={3}
          />
          <button type="submit" className="btn-primary">
            Add Task
          </button>
        </form>
      </div>

      <div className="board">
        <div className="column">
          <h3 className="column-title todo">To Do</h3>
          {getTasksByStatus('todo').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>

        <div className="column">
          <h3 className="column-title inprogress">In Progress</h3>
          {getTasksByStatus('inprogress').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>

        <div className="column">
          <h3 className="column-title done">Done</h3>
          {getTasksByStatus('done').map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdateStatus={updateStatus}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskCard({ 
  task, 
  onUpdateStatus, 
  onDelete 
}: { 
  task: Task; 
  onUpdateStatus: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="task-card">
      <h4 className="task-title">{task.title}</h4>
      <p className="task-desc">{task.description}</p>
      
      <div className="task-actions">
        {task.status !== 'todo' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'todo')}
            className="btn-small btn-todo"
          >
            ← To Do
          </button>
        )}
        {task.status !== 'inprogress' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'inprogress')}
            className="btn-small btn-progress"
          >
            In Progress
          </button>
        )}
        {task.status !== 'done' && (
          <button
            onClick={() => onUpdateStatus(task.id, 'done')}
            className="btn-small btn-done"
          >
            Done →
          </button>
        )}
      </div>
      
      <button onClick={() => onDelete(task.id)} className="btn-delete">
        Delete
      </button>
    </div>
  );
}

export default App;

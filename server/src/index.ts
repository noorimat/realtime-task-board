import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { initDatabase, getTasks, createTask, updateTask, deleteTask } from './database';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

initDatabase().catch(console.error);

io.on('connection', async (socket) => {
  console.log('User connected:', socket.id);
  
  try {
    const tasks = await getTasks();
    socket.emit('tasks:load', tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
  
  socket.on('task:create', async (task) => {
    try {
      const newTask = { ...task, id: Date.now().toString() };
      await createTask(newTask);
      io.emit('task:created', newTask);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  });
  
  socket.on('task:update', async (updatedTask) => {
    try {
      await updateTask(updatedTask);
      io.emit('task:updated', updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  });
  
  socket.on('task:delete', async (taskId) => {
    try {
      await deleteTask(taskId);
      io.emit('task:deleted', taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

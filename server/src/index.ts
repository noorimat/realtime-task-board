import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

// In-memory storage for now (we'll add DB later)
let tasks: any[] = [];

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Send existing tasks to new client
  socket.emit('tasks:load', tasks);
  
  // Create task
  socket.on('task:create', (task) => {
    const newTask = { ...task, id: Date.now().toString() };
    tasks.push(newTask);
    io.emit('task:created', newTask);
  });
  
  // Update task
  socket.on('task:update', (updatedTask) => {
    tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
    io.emit('task:updated', updatedTask);
  });
  
  // Delete task
  socket.on('task:delete', (taskId) => {
    tasks = tasks.filter(t => t.id !== taskId);
    io.emit('task:deleted', taskId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

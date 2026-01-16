# Real-Time Collaborative Task Board

A modern, real-time task management application built with WebSockets. Multiple users can collaborate simultaneously with instant synchronization across all connected clients.

## Demo

[![Task Board Demo](https://img.youtube.com/vi/6xdzvhUEz_c/maxresdefault.jpg)](https://youtu.be/6xdzvhUEz_c)

*Click to watch: Real-time collaboration with WebSocket synchronization*

## Features

- **Real-Time Synchronization**: WebSocket-powered live updates across all clients
- **Kanban Board**: Move tasks between To Do, In Progress, and Done columns
- **Modern UI**: Beautiful gradient design with smooth animations
- **Type-Safe**: Built with TypeScript for reliability
- **Collaborative**: Multiple users can work together in real-time
- **Persistent Storage**: PostgreSQL database for data persistence

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Socket.io Client (WebSocket)
- Custom CSS with animations

**Backend:**
- Node.js + Express
- Socket.io Server (WebSocket)
- TypeScript
- PostgreSQL database

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/noorimat/realtime-task-board.git
cd realtime-task-board
```

2. Set up PostgreSQL:
```bash
createdb taskboard
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Install frontend dependencies:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server (Terminal 1):
```bash
cd server
npm run dev
```
Server runs on http://localhost:3001

2. Start the frontend (Terminal 2):
```bash
cd client
npm run dev
```
Frontend runs on http://localhost:5173

3. Open http://localhost:5173 in multiple browser windows to see real-time collaboration!

## How It Works

### WebSocket Communication

The app uses Socket.io for bi-directional real-time communication:

- **Client → Server**: Emits events (create, update, delete tasks)
- **Server → All Clients**: Broadcasts updates to keep everyone in sync
- **PostgreSQL**: Persists all data for reliability

### Event Flow
```
User creates task → Client emits 'task:create' 
                 → Server saves to database
                 → Server broadcasts 'task:created' 
                 → All clients update UI instantly
```

## Project Structure
```
realtime-task-board/
├── client/              # React frontend
│   ├── src/
│   │   ├── App.tsx      # Main component with Socket.io logic
│   │   ├── App.css      # Styling with animations
│   │   └── main.tsx     # Entry point
│   └── package.json
├── server/              # Node.js backend
│   ├── src/
│   │   ├── index.ts     # Express + Socket.io server
│   │   └── database.ts  # PostgreSQL queries
│   └── package.json
└── README.md
```

## Features Demonstrated

- **Full-Stack Development**: Frontend + Backend integration
- **Real-Time Communication**: WebSocket implementation
- **Database Integration**: PostgreSQL with connection pooling
- **State Management**: React hooks (useState, useEffect)
- **Event-Driven Architecture**: Socket.io events
- **TypeScript**: Type safety across the stack
- **Modern UI/UX**: CSS animations, gradients, and hover effects

## API Events

### Client → Server

- `task:create` - Create a new task
- `task:update` - Update task status
- `task:delete` - Delete a task

### Server → Client

- `tasks:load` - Initial tasks on connection
- `task:created` - New task created
- `task:updated` - Task status changed
- `task:deleted` - Task removed

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Drag-and-drop between columns
- [ ] Task assignment to specific users
- [ ] Due dates and priority levels
- [ ] File attachments
- [ ] Email notifications
- [ ] Deploy to production (Vercel + Railway/Render)

## License

MIT License

## Author

Built to demonstrate real-time full-stack development capabilities with modern web technologies.

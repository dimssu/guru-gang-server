require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); 
const socketIO = require('socket.io'); 
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const userRoutes= require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const quizRoutes = require('./routes/quizRoutes');
const conceptBattleRoutes = require('./routes/conceptBattleRoutes');
const slideRoutes = require('./routes/slideRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
const port = 5001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Routes 
app.use('/api/auth',authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/concept-battle', conceptBattleRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/progress', progressRoutes);

// Socket.IO setup
const server = http.createServer(app); 
const io = socketIO(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

server.listen(port, () => { 
  console.log(`Server is running on port: ${port}`);
});
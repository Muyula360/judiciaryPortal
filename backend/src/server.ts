import app from './app';

const PORT = process.env.PORT || 5001;

console.log('🔵 Before listen...');
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
console.log('🔵 After listen...');

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Keep the process alive for debugging (temporary)
setInterval(() => {}, 1000);
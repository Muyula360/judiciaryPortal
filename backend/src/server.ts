import app from './app';

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

setInterval(() => {}, 1000);
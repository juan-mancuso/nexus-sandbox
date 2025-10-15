import express from 'express';
import router from './routes.js';
import swaggerRouter from './swagger.js';

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
	res.send('🚀 SDK Test Server is running');
});

// SDK routes
app.use('/api', router);

// Swagger Docs
app.use('/docs', swaggerRouter);

export default app;

// For local testing
if (process.env.NODE_ENV !== 'lambda') {
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`✅ Server running on http://localhost:${port}`);
		console.log(`📄 Swagger UI available at http://localhost:${port}/docs`);
	});
}

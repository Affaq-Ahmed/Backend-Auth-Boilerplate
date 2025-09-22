export const validate = (schema) => (req, _res, next) => {
	const data = { body: req.body, query: req.query, params: req.params };
	const result = schema.safeParse(data);
	if (!result.success) {
		return next({
			status: 422,
			message: 'Validation error',
			details: result.error.flatten(),
		});
	}
	// attach parsed data if needed
	req.validated = result.data;
	next();
};

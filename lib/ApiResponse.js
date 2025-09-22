// Ensures every JSON response has the same envelope.
// Adds res.ok() and res.created() helpers too.
export const responseEnvelope = (_req, res, next) => {
	const originalJson = res.json.bind(res);

	res.json = (payload) => {
		// If already enveloped, pass through (lets you bypass when needed)
		if (payload && (payload.success === true || payload.success === false)) {
			return originalJson(payload);
		}
		const statusCode = res.statusCode || 200;
		const message = res.locals.message || 'OK';
		return originalJson({ success: true, statusCode, message, data: payload });
	};

	res.ok = (data, message = 'OK') =>
		res.status(200).json({ success: true, statusCode: 200, message, data });

	res.created = (data, message = 'Created') =>
		res.status(201).json({ success: true, statusCode: 201, message, data });

	next();
};

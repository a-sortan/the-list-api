function errorHandler(error, request, response, next) {
	return response.status(error.status || 500).json({
		error: {
			status: error.status||500,
			success: false,
			message: error.message || 'Oops! Something went wrong'
		}
	});
};

module.exports = errorHandler;


const responseHandler = {
  success: (res, data, message = 'Success') => {
    res.status(200).json({ message, data });
  },
  error: (res, error, statusCode = 500) => {
    res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
  },
};

export default responseHandler; 
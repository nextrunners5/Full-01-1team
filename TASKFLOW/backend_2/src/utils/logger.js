const logger = {
  info: (message) => {
    console.log(`INFO: ${message}`);
  },
  error: (message) => {
    console.error(`ERROR: ${message}`);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`DEBUG: ${message}`);
    }
  },
};

export default logger;

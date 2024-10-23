export const formatErrorResponse = (error: Error) => {
  return {
    error: error.name || 'UnknownError',
    message: error.message || 'An error occurred'
  }
}

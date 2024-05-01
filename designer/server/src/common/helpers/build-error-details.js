function buildErrorDetails(errorDetails) {
  return errorDetails.reduce((errors, detail) => {
    return {
      [detail.context.key]: {
        message: detail.message
      },
      ...errors
    }
  }, {})
}

export { buildErrorDetails }

export const handleError = (res, status, message) => {
  return res.status(status).json({ success: false, message });
};

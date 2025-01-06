const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error); // Передаємо помилку далі в errorHandler
    }
  };
};

export default ctrlWrapper;

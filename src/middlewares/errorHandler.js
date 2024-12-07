export default (err, req, res, next) => {
  console.error(err); // Логування помилки для налагодження
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message || err,
  });
};

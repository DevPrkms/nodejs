function doConnectAPI(req, res) {
  res.status(200).json({
    success: true,
  });
}

function doPostAPI(req, res) {
  const user_message = req.body.message;
  res.status(200).json({
    message: user_message,
  });
}

module.exports = {
  doConnectAPI: doConnectAPI,
  doPostAPI: doPostAPI,
};

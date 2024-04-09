const getWebhookResp = async (req, res) => {
  res.status(200).json({ message: "Response received" });
};

const postWebhookResp = async (req, res) => {
  res.status(200).json({ message: "Response received" });
};

export { getWebhookResp, postWebhookResp };

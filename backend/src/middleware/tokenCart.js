export const tokenCartShoping = async (req, res) => {
    const { email } = req.body.cart;
    jwt.sign(
      { email: email },
      process.env.JWT,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          res.status(500).send(err);
        } else {
          req.tokenCart = token;
        }
      }
    );
  };
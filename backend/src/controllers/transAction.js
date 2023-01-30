import db from "../model/index.js";

export const getTransaction = async (req, res) => {
  const id = req.query.id;
  if (!id) {
    try {
      const trans = await db.Transaction.findAll({});
      res.json({
        data: trans,
        message: "success",
        status: 200,
      });
    } catch (error) {
      res.json({
        data: [],
        message: "fiald",
        status: 500,
      });
    }
    return;
  }

  try {
    const trans = await db.Transaction.findAll({
      where: { userId: id },
    });
    res.json({
      data: trans,
      message: "success",
      status: 200,
    });
  } catch (error) {
    res.json({
      data: [],
      message: "fiald",
      status: 500,
    });
  }
};

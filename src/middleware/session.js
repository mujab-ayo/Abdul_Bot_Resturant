const Session = require("../models/Session");
const { v4: uuidv4 } = require("uuid");

const createCookieandSession = async (req, res) => {
  const newId = uuidv4();

  res.cookie("session_id", newId, { httpOnly: true });

  const newSession = await Session.create({
    userId: newId,
    currentState: "MAIN_MENU",
  });

  req.sessionData = newSession;
};

async function attachSession(req, res, next) {
  try {
    const cookieId = req.cookies.session_id;

    if (cookieId) {
      const session = await Session.findOne({ userId: cookieId });

      if (session) {
        session.updatedAt = new Date();
        await session.save();
        req.sessionData = session;
      } else {
        await createCookieandSession(req, res);
      }
    } else {
      await createCookieandSession(req, res);
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = attachSession;

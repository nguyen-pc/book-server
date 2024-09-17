const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const {
    username,
    first_name,
    last_name,
    email,
    phoneNumber,
    password,
    password_confirm,
  } = req.body;

  if (
    !username ||
    !first_name ||
    !last_name ||
    !email ||
    // !phoneNumber ||
    !password ||
    !password_confirm
  ) {
    return res.status(422).json({ message: "Invalid field" });
  }

  if (password !== password_confirm) {
    return res.status(422).json({ message: "Password do not match" });
  }

  const userExist = await User.exists({ email });
  if (userExist) return res.sendStatus(409);

  try {
    hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      first_name,
      last_name,
      phoneNumber,
      password: hashedPassword,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not register", secure: true });
  }
}

async function logout(req, res) {
  const cookies = req.cookies;

  if (!cookies.refresh_token) return res.sendStatus(204);

  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (!user) {
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

  user.refresh_token = null;
  await user.save();

  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Invalid fields" });
  }

  const user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({ message: "Email or password incorrect" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(402).json({ message: "Email or password incorrect" });
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1800s",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  user.refresh_token = refreshToken;

  await user.save();

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 100,
    secure: true,
  });
  res.json({ access_token: accessToken });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies.refresh_token) {
    return res.sendStatus(401);
  }

  const refreshToken = cookies.refresh_token;

  const user = await User.findOne({ refresh_token: refreshToken }).exec();

  if (!user) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" }
    );

    res.json({ access_token: accessToken });
  });
}

async function user(req, res) {
  const user = req.user;
  return res.status(200).json(user);
}


async function getAllUser(req, res) {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const result = {};

    console.log(pageNumber, limit);

    const users = await User.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;

    result.users = users;
    const totalPage = Math.ceil(users / limit);
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await User.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }

    result.data = await User.find()
      .sort("-_id")
      .skip(startIndex)
      .limit(limit)
      .exec();

    result.rowsPerPage = limit;
    result.totalPage = totalPage;
    return res.status(200).json(result);
  } catch (e) {
    console.error("Error retrieving users:", e);
    return res
      .status(500)
      .json({ message: "Could not retrieve books", error: e.message });
  }
}



async function create(req, res) {
  const {
    username,
    first_name,
    last_name,
    email,
    address,
    isStaff,
    gender,
    phoneNumber,
    password,
    password_confirm,
    birthday,
  } = req.body;

  if (
    !username ||
    !first_name ||
    !last_name ||
    !email ||
    !phoneNumber ||
    !password ||
    !password_confirm ||
    // !isStaff ||
    !address ||
    !gender ||
    !birthday
  ) {
    return res.status(422).json({ message: "Invalid field" });
  }

  if (password !== password_confirm) {
    return res.status(422).json({ message: "Password do not match" });
  }

  const userExist = await User.exists({ email });
  if (userExist) return res.sendStatus(409);

  try {
    hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      first_name,
      last_name,
      phoneNumber,
      password: hashedPassword,
      isStaff,
      address,
      gender,
      birthday,
    });
    return res.sendStatus(201);
  } catch (e) {
    return res
      .status(400)
      .json({ message: "Could not register", secure: true });
  }
}

async function getUserById(req, res) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(405).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user by ID:", error);
    return res
      .status(500)
      .json({ message: "Could not retrieve user", error: error.message });
  }
}

async function updateUser(req, res) {
  const { userId } = req.params;
  const userData = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, userData, {
      new: true,
    }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ message: "Could not update user", error: error.message });
  }
}
async function deleteUser(req, res) {
  const userId = req.params; // Lấy userId từ tham số route
  try {
    const user = await User.findByIdAndDelete(userId.userId); // Xóa người dùng theo ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
  refresh,
  user,
  getAllUser,
  create,
  getUserById,
  updateUser,
  deleteUser,
};

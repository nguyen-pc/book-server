const connectDB = require("../config/database");
const readline = require("readline");
const User = require("../models/User");

connectDB();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists.");
      return;
    }

    // Prompt user for input
    rl.question("Nhập email: ", async (email) => {
      rl.question("Nhập mật khẩu: ", async (password) => {
        rl.question("Nhập họ: ", async (first_name) => {
          rl.question("Nhập tên: ", async (last_name) => {
            rl.question("Nhập SĐT: ", async (phoneNumber) => {
              // Hash admin password

              // Create admin user
              await User.create({
                email,
                password,
                first_name,
                last_name,
                phoneNumber,
                isStaff: true,
              });

              console.log("Tạo tài khoản admin thành công.");
              rl.close();
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

createAdminUser();

module.exports = createAdminUser;

import db from "../../models/index.js";
const { User } = db;

// GET all users
export async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "role", "createdAt"], 
      order: [["id", "ASC"]], 
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

// Update role (admin/user) by admin
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    if (Number(id) === req.user.userId) {
      return res.status(403).json({ error: "You cannot change your own role" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update role" });
  }
}

import db from "../../models/index.js";
const { User } = db;
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        }

        // 2. Валидация email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

        // 3. Валидация пароля
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long"
            });
        }

        const existingUser = await User.findOne({ where: { email } })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            email,
            passwordHash
        })

        const token = jwt.sign({ userId: newUser.id, email: newUser.email, role: newUser.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        )

        res.status(201).json({ token })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" })
        };

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "This user does not exist" })
        };

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        };



        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
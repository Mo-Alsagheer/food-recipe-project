import * as userService from "./user.service.js";

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required" });
        }
        const user = await userService.createUserService({ name, email, password, role });
        
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json(userObj);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsersService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserByIdService(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUserService(req.params.id, req.body);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUserService(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

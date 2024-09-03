import User from "../models/userModel.js";

const registerUser = async (req, res) => {
   try {
      const { name, email, password } = await req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: "Please provide name, email and password" });
      }

      const user = await User.create({ name, email, password });

      res.status(201).json({
         _id: user._id,
         message: "User created successfully",
         status: "success",
      });
   } catch (error) {
      res.status(500).json(error?.message || error);
   }
};

export { registerUser };

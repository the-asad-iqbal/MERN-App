import { User } from "../models/userModel.js";

const registerUser = async (req, res) => {
   try {
      const { name, email, password } = await req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: "Please provide name, email and password" });
      }

      const user = await User.create({ name, email, password });

      const token = await user.generateRefreshToken();

      user.refreshToken = token.toString();
      await user.save();

      return res
         .cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            exprire: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
         })
         .status(201)
         .json({
            user,
            message: "User created successfully",
            status: "success",
         });
   } catch (error) {
      res.status(500).json(error?.message || error);
   }
};

const loginUser = async (req, res) => {
   try {
      const { email, password } = await req.body;

      if (!email || !password) {
         return res.status(400).json({ message: "Please provide email and password" });
      }

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = user.generateRefreshToken();

      user.refreshToken = token;
      await user.save();

      return res
         .cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            exprire: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 7days
         })
         .status(200)
         .json({
            _id: user._id,
            message: "Login successful",
            status: "success",
         });
   } catch (error) {
      return res.status(500).json(error?.message || error);
   }
};

const userProfile = async (req, res) => {
   try {
      const { _id } = req.user;
      const user = await User.findById(_id);
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({
         user,
         status: "success",
         message: "User profile fetched successfully",
      });
   } catch (error) {
      return res.status(500).json(error?.message || error);
   }
};

export { registerUser, loginUser, userProfile };

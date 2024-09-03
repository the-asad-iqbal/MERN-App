import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const protectedRoute = async (req, res, next) => {
   try {
      const access_token = await req.cookies.access_token;

      if (!access_token) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      const payload = jwt.verify(access_token, process.env.JWT_SECRET);
      const { _id } = payload;

      const user = await User.findById(_id);

      if (!user) {
         return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;

      next();
   } catch (error) {
      return res.status(500).json({ message: error?.message || error, status: "error" });
   }
};

export { protectedRoute };

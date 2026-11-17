import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import {notFound,errorHandler} from "./middleware/error.js";

const app=express();
app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}}));
app.use(cors({origin:process.env.CLIENT_ORIGIN?.split(",")||"http://localhost:5173"}));
app.use(express.json({limit:"1mb"}));
app.use("/uploads",express.static(path.resolve("uploads")));
app.get("/api/health",(req,res)=>res.json({status:"ok",service:"bug-tracker-api"}));
app.use("/api/auth",authRoutes);
app.use("/api/projects",projectRoutes);
app.use("/api/tickets",ticketRoutes);
app.use(notFound); app.use(errorHandler);

const port=process.env.PORT||8084;
connectDB().then(()=>app.listen(port,()=>console.log(`API running on ${port}`)))
.catch(err=>{console.error("Startup failed:",err.message);process.exit(1);});

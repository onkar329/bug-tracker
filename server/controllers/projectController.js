import Project from "../models/Project.js";
import User from "../models/User.js";
import Ticket from "../models/Ticket.js";
import { memberRole } from "../utils/access.js";

export async function listProjects(req,res,next) {
  try {
    const projects = await Project.find({ $or:[{owner:req.user._id},{ "members.user":req.user._id }] })
      .populate("owner","name email").populate("members.user","name email");
    res.json({ projects });
  } catch(e){next(e);}
}
export async function createProject(req,res,next) {
  try {
    const {name,description,key} = req.body;
    if(!name?.trim()) return res.status(400).json({message:"Project name is required"});
    const projectKey=(key || name.replace(/[^a-zA-Z0-9]/g,"").slice(0,5)).toUpperCase();
    const exists=await Project.findOne({key:projectKey,owner:req.user._id});
    if(exists) return res.status(409).json({message:"You already own a project with this key"});
    const project=await Project.create({name,description,key:projectKey,owner:req.user._id,members:[{user:req.user._id,role:"Admin"}]});
    res.status(201).json({project});
  }catch(e){next(e);}
}
export async function getProject(req,res,next) {
  try {
    const project=await Project.findById(req.params.id).populate("owner","name email").populate("members.user","name email");
    if(!project) return res.status(404).json({message:"Project not found"});
    if(!memberRole(project,req.user._id)) return res.status(403).json({message:"No access to this project"});
    res.json({project});
  }catch(e){next(e);}
}
export async function updateProject(req,res,next) {
  try {
    const project=await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    if(!["Admin","Manager"].includes(memberRole(project,req.user._id))) return res.status(403).json({message:"Manager/Admin permission required"});
    project.name=req.body.name ?? project.name; project.description=req.body.description ?? project.description;
    await project.save(); res.json({project});
  }catch(e){next(e);}
}
export async function deleteProject(req,res,next) {
  try {
    const project=await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    if(memberRole(project,req.user._id)!=="Admin") return res.status(403).json({message:"Admin permission required"});
    await Ticket.deleteMany({project:project._id}); await project.deleteOne();
    res.json({message:"Project deleted"});
  }catch(e){next(e);}
}
export async function addMember(req,res,next) {
  try {
    const project=await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    if(!["Admin","Manager"].includes(memberRole(project,req.user._id))) return res.status(403).json({message:"Manager/Admin permission required"});
    const user=await User.findOne({email:String(req.body.email||"").toLowerCase()});
    if(!user) return res.status(404).json({message:"No registered user found with that email"});
    if(project.members.some(m=>String(m.user)===String(user._id))) return res.status(409).json({message:"User is already a member"});
    const role=["Manager","Developer","Viewer"].includes(req.body.role)?req.body.role:"Developer";
    project.members.push({user:user._id,role}); await project.save();
    await project.populate("members.user","name email"); res.status(201).json({project});
  }catch(e){next(e);}
}
export async function removeMember(req,res,next) {
  try {
    const project=await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    if(!["Admin","Manager"].includes(memberRole(project,req.user._id))) return res.status(403).json({message:"Manager/Admin permission required"});
    if(String(project.owner)===req.params.userId) return res.status(400).json({message:"Project owner cannot be removed"});
    project.members=project.members.filter(m=>String(m.user)!==req.params.userId);
    await project.save(); res.json({project});
  }catch(e){next(e);}
}

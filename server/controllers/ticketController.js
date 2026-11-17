import Ticket from "../models/Ticket.js";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import { memberRole, canEdit } from "../utils/access.js";
const statuses=["To Do","In Progress","Done"], priorities=["Low","Medium","High","Critical"];
async function accessibleProject(id,userId) {
  const p=await Project.findById(id); return p && memberRole(p,userId) ? p : null;
}
export async function listTickets(req,res,next) {
  try {
    const project=await accessibleProject(req.query.project,req.user._id);
    if(!project) return res.status(403).json({message:"Project access required"});
    const filter={project:project._id};
    if(statuses.includes(req.query.status)) filter.status=req.query.status;
    if(priorities.includes(req.query.priority)) filter.priority=req.query.priority;
    if(req.query.assignee) filter.assignee=req.query.assignee;
    if(req.query.q) filter.$or=[{title:{$regex:req.query.q,$options:"i"}},{description:{$regex:req.query.q,$options:"i"}}];
    const tickets=await Ticket.find(filter).populate("assignee","name email").populate("reporter","name email").sort({updatedAt:-1});
    res.json({tickets});
  }catch(e){next(e);}
}
export async function createTicket(req,res,next) {
  try {
    const project=await accessibleProject(req.body.project,req.user._id);
    if(!project) return res.status(403).json({message:"Project access required"});
    const role=memberRole(project,req.user._id);
    if(!canEdit(role)) return res.status(403).json({message:"Viewer cannot create tickets"});
    const {title,description,priority,status,type,assignee}=req.body;
    if(!title?.trim()) return res.status(400).json({message:"Ticket title is required"});
    if(assignee && !project.members.some(m=>String(m.user)===String(assignee))) return res.status(400).json({message:"Assignee must be a project member"});
    const ticket=await Ticket.create({title,description,project:project._id,reporter:req.user._id,assignee:assignee||null,
      priority:priorities.includes(priority)?priority:"Medium",status:statuses.includes(status)?status:"To Do",
      type:["Bug","Feature","Task"].includes(type)?type:"Bug",
      attachments:(req.files||[]).map(f=>({filename:f.originalname,path:`/uploads/${f.filename}`}))});
    await ticket.populate(["assignee","reporter"]); res.status(201).json({ticket});
  }catch(e){next(e);}
}
export async function updateTicket(req,res,next) {
  try {
    const ticket=await Ticket.findById(req.params.id).populate("project");
    if(!ticket) return res.status(404).json({message:"Ticket not found"});
    const role=memberRole(ticket.project,req.user._id);
    if(!canEdit(role)) return res.status(403).json({message:"Insufficient permission"});
    if(req.body.title!==undefined) ticket.title=req.body.title;
    if(req.body.description!==undefined) ticket.description=req.body.description;
    if(statuses.includes(req.body.status)) ticket.status=req.body.status;
    if(priorities.includes(req.body.priority)) ticket.priority=req.body.priority;
    if(["Bug","Feature","Task"].includes(req.body.type)) ticket.type=req.body.type;
    if(req.body.assignee!==undefined) {
      if(req.body.assignee && !ticket.project.members.some(m=>String(m.user)===String(req.body.assignee))) return res.status(400).json({message:"Assignee must be a project member"});
      ticket.assignee=req.body.assignee||null;
    }
    await ticket.save(); await ticket.populate(["assignee","reporter"]); res.json({ticket});
  }catch(e){next(e);}
}
export async function deleteTicket(req,res,next) {
  try {
    const ticket=await Ticket.findById(req.params.id).populate("project");
    if(!ticket) return res.status(404).json({message:"Ticket not found"});
    if(!["Admin","Manager"].includes(memberRole(ticket.project,req.user._id))) return res.status(403).json({message:"Manager/Admin permission required"});
    await Comment.deleteMany({ticket:ticket._id}); await ticket.deleteOne(); res.json({message:"Ticket deleted"});
  }catch(e){next(e);}
}
export async function listComments(req,res,next) {
  try {
    const ticket=await Ticket.findById(req.params.id).populate("project");
    if(!ticket || !memberRole(ticket.project,req.user._id)) return res.status(404).json({message:"Ticket not found"});
    const comments=await Comment.find({ticket:ticket._id}).populate("author","name").sort({createdAt:1});
    res.json({comments});
  }catch(e){next(e);}
}
export async function addComment(req,res,next) {
  try {
    const ticket=await Ticket.findById(req.params.id).populate("project");
    if(!ticket || !memberRole(ticket.project,req.user._id)) return res.status(404).json({message:"Ticket not found"});
    if(!req.body.text?.trim()) return res.status(400).json({message:"Comment cannot be empty"});
    const comment=await Comment.create({ticket:ticket._id,author:req.user._id,text:req.body.text});
    await comment.populate("author","name"); res.status(201).json({comment});
  }catch(e){next(e);}
}

import {Router} from "express";
import auth from "../middleware/auth.js";
import {upload} from "../middleware/upload.js";
import {listTickets,createTicket,updateTicket,deleteTicket,listComments,addComment} from "../controllers/ticketController.js";
const router=Router(); router.use(auth);
router.route("/").get(listTickets).post(upload.array("screenshots",5),createTicket);
router.route("/:id").put(updateTicket).delete(deleteTicket);
router.route("/:id/comments").get(listComments).post(addComment);
export default router;

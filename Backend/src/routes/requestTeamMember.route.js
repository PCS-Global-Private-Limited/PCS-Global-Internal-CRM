import express from "express";

import { requestTeamMember, listTeamMemberRequests, getTeamMemberRequestById, updateTeamMemberRequestStatus } from "../controllers/requestTemMember.controller.js";

const requestTeamMemberRouter = express.Router();

requestTeamMemberRouter.post("/request-team-member", requestTeamMember);
requestTeamMemberRouter.get("/request-team-member", listTeamMemberRequests);
requestTeamMemberRouter.get("/request-team-member/:id", getTeamMemberRequestById);
requestTeamMemberRouter.patch("/request-team-member/:id/status", updateTeamMemberRequestStatus);

export default requestTeamMemberRouter;

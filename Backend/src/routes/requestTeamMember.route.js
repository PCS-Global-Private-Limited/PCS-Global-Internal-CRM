import express from "express";

import { requestTeamMember } from "../controllers/requestTemMember.controller.js";

const requestTeamMemberRouter = express.Router();

requestTeamMemberRouter.post("/request-team-member", requestTeamMember);

export default requestTeamMemberRouter;

import { z } from "zod";
import { Board } from "@/prisma/generated/client";

import { ActionState } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";

export type InputType = z.infer<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;

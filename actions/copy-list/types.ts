import { z } from "zod";
import { List } from "@/prisma/generated/client";

import { ActionState } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

export type InputType = z.infer<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;

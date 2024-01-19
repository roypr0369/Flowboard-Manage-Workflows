'use server';

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@/prisma/generated/client";
import { hasAvailableCount, incrementAvailableCount } from "@/lib/org-limit";
import { checkSubsription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> =>{
    const { userId, orgId } = auth();

    if(!userId || !orgId){
        return {
            error: "Unauthorized",
        };
    }

    const canCreate = await hasAvailableCount();
    const isPro = await checkSubsription();

    if(!canCreate && !isPro){
        return {
            error: "You have reached your limit of free boards. Please upgrade to create more."
        }
    }

    const {title, image} = data;

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
    ] = image.split("|");

    // console.log({
    //     imageId,
    //     imageThumbUrl,
    //     imageFullUrl,
    //     imageLinkHTML,
    //     imageUserName,
    // });

    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageUserName || !imageLinkHTML){
        return {
            error: "Missing fields. Failed to create a board."
        };
    };

    let board;

    try{
        // throw new Error("a");
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML,
            }
        });

        if(!isPro) {
            await incrementAvailableCount();
        }

        await createAuditLog({
            entityTitle: board.title,
            entityId: board.id,
            entityType: ENTITY_TYPE.BOARD,
            action: ACTION.CREATE,
          });
    } catch(error) {
        return {
            error: "Failed to create."
        }
    }

    revalidatePath(`/board/${board.id}`);
    return {data: board};
};

export const createBoard = createSafeAction(CreateBoard, handler);

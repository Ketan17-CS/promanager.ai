import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Loader } from "lucide-react";
import { Button } from "../ui/button";

export default function SuggestMissingTask({
    projectId,
    isSubTask = false,
    taskName = '',
    description = '',
    parentId,
}: {
    projectId: Id<"projects">;
    isSubTask?: boolean;
    taskName?: string;
    description?: string;
    parentId?: Id<'todos'>;
}) {
    const [isLoadingSuggestMissingTasks,
        setIsLoadingSuggestMissingTasks] = useState(false);

    const SuggestMissingTask =
        useAction(api.myAi.suggestMissingItemsWithAi) || [];

    const MissingSubTask =
        useAction(api.myAi.suggestMissingSubItemsWithAi) || [];

    const handleMissingTasks = async () => {
        setIsLoadingSuggestMissingTasks(true);
        try {
            await SuggestMissingTask({ projectId });
        } catch (error) {
            console.log("Error in MissingTasks", error);
        } finally {
            setIsLoadingSuggestMissingTasks(false);
        }
    };

    const handleMissingSubTasks = async () => {
        setIsLoadingSuggestMissingTasks(true);
        try {
            if (parentId) {
                await MissingSubTask({
                    projectId,
                    taskName,
                    description,
                    parentId,
                });
            }
        } catch (error) {
            console.log("Error in MissingSubTask", error);
        } finally {
            setIsLoadingSuggestMissingTasks(false);
        }
    };

    return (
        <>
            <Button
                variant={"outline"}
                disabled={isLoadingSuggestMissingTasks}
                onClick={isSubTask ? handleMissingSubTasks :
                    handleMissingTasks}
            >
                {isLoadingSuggestMissingTasks ? (
                    <div className="flex gap-2">
                        Loading Tasks (AI)
                        <Loader className="h-5 w-5 text-primary" />
                    </div>
                ) : (
                    "Suggest Missing Tasks (AI) 🤖"

                )}
            </Button>
        </>
    );
}
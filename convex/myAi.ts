// import { v } from "convex/values";
// import { api } from "./_generated/api";
// import { action } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const apiKey = new GoogleGenerativeAI(process.env.GEMINI_AI_KEY);
// const gemini = apiKey.getGenerativeModel({ model: "gemini-1.5-flash",generationConfig: { responseMimeType: "application/json" } });

// export const suggestMissingItemsWithAi = action({
//   args: {
//     projectId: v.id("projects"),
//   },
//   handler: async (ctx, { projectId }) => {
//     const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
//       projectId,
//     });
//     const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
//       projectId,
//     });
//     const projectName = project?.name || "";

//     let prompt = `
//     I'm a project manager and I need help identifying missing to-do items.
//     I have a list of existing tasks: ${JSON.stringify(todos)}, containing objects with 'taskName' and 'description' properties.
//     Can you help me identify 3 additional to-do items for the project that is not yet included in this list?
//     I also have a good understanding of the project scope, which is ${projectName}.
//     Please provide the missing item as a task name and description.
//     Ensure there are no duplicates between the existing list and the new suggestion.
//     Using this JSON schema (Note: Also dont include project name in description):
//     { "taskName": "type": "string",
//       "description": "type": "string"},
//     }`;

//     const result = await gemini.generateContent(prompt);
//     const res = result.response.text();
//     const cleanedResponse = res.replace(/^'/, '').replace(/['\n]/g, '');
//     const tasks = JSON.parse(cleanedResponse);

//     console.log(tasks)

//     for (const task of tasks) {
//       const { taskName, description } = task;

//       if (taskName && description) {
//         const embedding = await getEmbeddingsWithAI(taskName);
//         const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn";

//         await ctx.runMutation(api.todos.createATodo, {
//           taskName,
//           description,
//           priority: 1,
//           dueDate: new Date().getTime(),
//           projectId,
//           labelId: AI_LABEL_ID as Id<"labels">,
//           embedding,
//         });
//       }
//     }
//   },
// });

// export const suggestMissingSubItemsWithAi = action({
//   args: {
//     projectId: v.id("projects"),
//     parentId: v.id("todos"),
//     taskName: v.string(),
//     description: v.string(),
//   },
//   handler: async (ctx, { projectId, parentId, taskName, description }) => {

//     const subTodos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
//       parentId,
//     });
//     const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
//       projectId,
//     });
//     const projectName = project?.name || "";

//     let prompt = `
//     I'm a project manager and I need help identifying missing sub tasks for a Parent Todo, Also here is the Parent Todo Task Name: ${JSON.stringify(taskName)} and Description: ${JSON.stringify(description)}.
//     I have a list of existing sub tasks: ${JSON.stringify(subTodos)}, containing objects with 'taskName' and 'description' properties.
//     Can you help me identify 3 additional to-do items for the project that is not yet included in this list?
//     I also have a good understanding of the project scope, which is ${projectName}.
//     Please provide the missing sub task as a task name and description.
//     Ensure there are no duplicates between the existing list and the new suggestion.
//     Using this JSON schema (Note: Also dont include project name in description):
//     { "taskName": "type": "string",
//       "description": "type": "string"},
//     }`;

//     const result = await gemini.generateContent(prompt);
//     const res = result.response.text();
//     const cleanedResponse = res.replace(/^'/, '').replace(/['\n]/g, '');
//     const tasks = JSON.parse(cleanedResponse);

//     console.log(tasks)

//     for (const task of tasks) {
//       const { taskName, description } = task;

//       if (taskName && description) {
//         const embedding = await getEmbeddingsWithAI(taskName);
//         const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn";

//         await ctx.runMutation(api.subTodos.createASubTodo, {
//           taskName,
//           description,
//           priority: 1,
//           dueDate: new Date().getTime(),
//           projectId,
//           parentId,
//           labelId: AI_LABEL_ID as Id<"labels">,
//           embedding,
//         });
//       }
//     }
//   },
// });

// export const getEmbeddingsWithAI = async (searchText: string) => {
//   if (!apiKey) {
//     throw new Error("Gemini AI Key is not defined");
//   }

//   const model = apiKey.getGenerativeModel({ model: "text-embedding-004" });
//   const text = searchText;
//   const result = await model.embedContent(text);

//   const vector = result.embedding.values;
//   console.log(`Embedding of ${searchText}: , ${vector.length} dimensions`);
//   return vector;
// };


// below code for openAi integration but it paid I haven't purchased it yet ////////////////////////////////////////////////////


import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";

import OpenAI from "openai";
import { Id } from "./_generated/dataModel";

const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey });

export const suggestMissingItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    //retrieve todos for the user
    const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
      projectId,
    });

    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId,
    });
    const projectName = project?.name || "";

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 5 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-3.5-turbo",
    });

    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;

    console.log({ messageContent });

    //create the todos
    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];
      const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn";

      for (let i = 0; i < items.length; i++) {
        const { taskName, description } = items[i];
        const embedding = await getEmbeddingsWithAI(taskName);
        await ctx.runMutation(api.todos.createATodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          labelId: AI_LABEL_ID as Id<"labels">,
          embedding,
        });
      }
    }
  },
});

export const suggestMissingSubItemsWithAi = action({
  args: {
    projectId: v.id("projects"),
    parentId: v.id("todos"),
    taskName: v.string(),
    description: v.string(),
  },
  handler: async (ctx, { projectId, parentId, taskName, description }) => {
    //retrieve todos for the user
    const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
      parentId,
    });

    const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
      projectId,
    });
    const projectName = project?.name || "";

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.",
        },
        {
          role: "user",
          content: JSON.stringify({
            todos,
            projectName,
            ...{ parentTodo: { taskName, description } },
          }),
        },
      ],
      response_format: {
        type: "json_object",
      },
      model: "gpt-3.5-turbo",
    });

    console.log(response.choices[0]);

    const messageContent = response.choices[0].message?.content;

    console.log({ messageContent });

    //create the todos
    if (messageContent) {
      const items = JSON.parse(messageContent)?.todos ?? [];
      const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn";

      for (let i = 0; i < items.length; i++) {
        const { taskName, description } = items[i];
        const embedding = await getEmbeddingsWithAI(taskName);
        await ctx.runMutation(api.subTodos.createASubTodo, {
          taskName,
          description,
          priority: 1,
          dueDate: new Date().getTime(),
          projectId,
          parentId,
          labelId: AI_LABEL_ID as Id<"labels">,
          embedding,
        });
      }
    }
  },
});

export const getEmbeddingsWithAI = async (searchText: string) => {
  if (!apiKey) {
    throw new Error("Open AI Key is not defined");
  }

  const req = {
    input: searchText,
    model: "text-embedding-ada-002",
    encoding_format: "float",
  };

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`OpenAI Error, ${msg}`);
  }

  const json = await response.json();
  const vector = json["data"][0]["embedding"];

  console.log(`Embedding of ${searchText}: , ${vector.length} dimensions`);

  return vector;
};
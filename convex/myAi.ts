// import { v } from "convex/values";
// import { action } from "./_generated/server";
// import { api } from "./_generated/api";
// import { Id } from "./_generated/dataModel";
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import { internalAction, internalMutation } from './_generated/server'

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

// export const suggestMissingItemsWithAi = action({
//   args: {
//     projectId: v.id("projects"),
//   },
//   handler: async (ctx, { projectId }) => {

//       // Retrieve todos for the user
//       const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {
//         projectId,
//       });

//       // Prepare Gemini prompt
//       const prompt = `I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 5 additional to-do items for the project that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.
//       Here are the existing tasks:${JSON.stringify({todos})}`;

//       // Call Gemini API
//       const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC0a3MGrBhqLVhv2nHeYsgY-NEPF0phJwU", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` // Replace with your Gemini API key
//         },
//         body: JSON.stringify({
//           "model": "gemini-1.5-flash", // Use the "gemini" model
//           "temperature": 0.7, // Adjust the temperature as needed
//           "messages": [{
//             "role": "user",
//             "content": prompt
//           }]
//         })
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Gemini API request failed with status ${response.status}`
//         );
//       }

//       const data = await response.json();
//       const messageContent = data.choices[0].message.content;

//       console.log({ messageContent });

//       // Create new todos
//       if (messageContent) {

//           const items = JSON.parse(messageContent)?.todos ?? [];
//           const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn"; // Define or retrieve label ID

//           for (let i = 0; i < items.length; i++) {
//             const { taskName, description } = items[i];
//             await ctx.runMutation(api.todos.createATodo, {
//               taskName,
//               description,
//               priority: 1,
//               dueDate: new Date().getTime(), // Consider a customizable due date
//               projectId,
//               labelId: AI_LABEL_ID as Id<"labels">,
//             });
//           }
//       }

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
//     try {
//       // Retrieve existing sub-todos
//       const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {
//         parentId,
//       });

//       const project = await ctx.runQuery(api.projects.getProjectByProjectId, {
//         projectId,
//       });
//       const projectName = project?.name || "";

//       // Prepare Gemini prompt
//       const prompt = `I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.
// Here are the existing sub-tasks: 
// ${JSON.stringify({todos})}
// The parent todo is: 
// ${JSON.stringify({taskName, description})}
// The project name is: 
// ${projectName}`;

//       // Call Gemini API
//       const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC0a3MGrBhqLVhv2nHeYsgY-NEPF0phJwU", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` // Replace with your Gemini API key
//         },
//         body: JSON.stringify({
//           "model": "gemini-1.5-flash", // Use the "gemini" model
//           "temperature": 0.7, // Adjust the temperature as needed
//           "messages": [{
//             "role": "user",
//             "content": prompt
//           }]
//         })
//       });

//       if (!response.ok) {
//         throw new Error(
//           `Gemini API request failed with status ${response.status}`
//         );
//       }

//       const data = await response.json();
//       const messageContent = data.choices[0].message.content;

//       console.log({ messageContent });

//       // Create new sub-todos
//       if (messageContent) {
//         try {
//           const items = JSON.parse(messageContent)?.todos ?? [];
//           const AI_LABEL_ID = "q975an79vypejxxx09z5y2newh71m9fn"; // Define or retrieve label ID

//           for (let i = 0; i < items.length; i++) {
//             const { taskName, description } = items[i];
//             // const embedding = await getEmbeddingsWithAI(taskName); 
//             await ctx.runMutation(api.subTodos.createASubTodo, {
//               taskName,
//               description,
//               priority: 1,
//               dueDate: new Date().getTime(), // Consider a customizable due date
//               projectId,
//               parentId,
//               labelId: AI_LABEL_ID as Id<"labels">,
//               // embedding
//             });
//           }
//         } catch (error) {
//           console.error("Error parsing JSON response:", error);
//         }
//       }
//     } catch (error) {
//       console.error("Error suggesting missing sub-items:", error);
//     }
//   },
// });



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
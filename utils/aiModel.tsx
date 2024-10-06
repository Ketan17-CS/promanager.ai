// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: "application/json",
// };

// // Pre-populate history with initial conversation (optional)
// export const chatSessionAi = model.startChat({
//     generationConfig,
//     history: [
//         {
//             role: "user",
//             parts: [
//                 { text: "\"I'm a project manager and I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 5 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.\"" },
//             ],
//         },
//         {
//             role: "model",
//             parts: [
//                 { text: "```json\n{\n  \"todos\": [\n    {\n      \"taskName\": \"Risk Assessment\",\n      \"description\": \"Identify and analyze potential risks to the project, including budget, schedule, and scope.\"\n    },\n    {\n      \"taskName\": \"Stakeholder Communication Plan\",\n      \"description\": \"Develop a plan for regular communication with key stakeholders throughout the project lifecycle.\"\n    },\n    {\n      \"taskName\": \"Project Closure Documentation\",\n      \"description\": \"Prepare a comprehensive project closure report, including lessons learned, project deliverables, and final budget.\"\n    },\n    {\n      \"taskName\": \"Quality Assurance Testing\",\n      \"description\": \"Conduct thorough testing of project deliverables to ensure they meet all requirements and specifications.\"\n    },\n    {\n      \"taskName\": \"Project Retrospective Meeting\",\n      \"description\": \"Facilitate a meeting with the project team to review the project's success, identify areas for improvement, and share feedback.\"\n    }\n  ]\n}\n```\n\n**Explanation:**\n\n* **Risk Assessment:** This is a crucial step to proactively address potential challenges and ensure project success.\n* **Stakeholder Communication Plan:** Effective communication with stakeholders is essential for managing expectations, ensuring alignment, and avoiding misunderstandings.\n* **Project Closure Documentation:** Formalizing project closure is vital for record-keeping, knowledge transfer, and future project planning.\n* **Quality Assurance Testing:**  Ensuring the quality of deliverables is essential for meeting project objectives and client satisfaction.\n* **Project Retrospective Meeting:**  Reflecting on the project helps identify best practices, learn from mistakes, and improve future projects.\n\n**Important Notes:**\n\n* These suggestions are generic and may not be relevant to all projects. Adapt them based on your specific project scope and requirements.\n* Compare the suggested tasks to your existing list to ensure there are no duplicates.\n* Consider your project's specific needs and priorities when adding new tasks.\n* You may need to adjust the task names and descriptions to better align with your project's terminology and context. \n" },
//             ],
//         },
//         {
//             role: "user",
//             parts: [
//                 { text: "\"I'm a project manager and I need help identifying missing sub tasks for a parent todo. I have a list of existing sub tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 2 additional sub tasks that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions.\"" },
//             ],
//         },
//         {
//             role: "model",
//             parts: [
//                 { text: "Please provide me with the JSON data containing your existing subtasks for the parent todo. I need to know what subtasks are already included in your list to accurately suggest two additional subtasks that are not yet included.\n\nOnce you provide the JSON data, I can analyze it and propose two relevant and non-duplicated subtasks based on your project scope. \n" },
//             ],
//         },
//     ],
// });

// // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// // console.log(result.response.text());

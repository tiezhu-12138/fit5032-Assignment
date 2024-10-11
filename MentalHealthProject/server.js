// import express from 'express'

// const app = express()
// const port = process.env.PORT || 3000

// // app.get('/', (req, res) => {
// //   res.send('Hello from Node.js!')
// // })

// // app.listen(port, () => {
// //   console.log(`Server is running on port ${port}`)
// // })
// import OpenAI from 'openai';
// import express from 'express';
// import cors from 'cors';

// const app = express();
// const openai = new OpenAI({
//   organization: "org-0y9o1Dn5ppYIGH2M6qnFZz13",
//   project: "proj_PvWFhat7sBV05riwGEFpU1sc"
//   // apiKey: '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'  
// });

// app.use(cors());
// app.use(express.json());

// app.post('/api/chat', async (req, res) => {
//   const { message } = req.body;
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: message }
//       ]
//     });
//     res.json(completion.choices[0].message);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// const port = 5001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

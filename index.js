const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

let INITIAL_TASKS = [
    { id: 1, title: "Task 1", done: true },
    { id: 2, title: "Task 2", done: false },
    { id: 3, title: "Task 3", done: false },
];

app.get("/", (req, res) => {
    res.status(200).json({
        "name": "Task API",
        "version": "1.0",
        "endpoints": ["/tasks"]
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
    });
});

app.get("/tasks", (req, res) => {
    res.status(200).json(
        INITIAL_TASKS
    );
});

app.get("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = INITIAL_TASKS.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }
    res.status(200).json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Invalid task title" });
    }
    const nextId = INITIAL_TASKS.length > 0 ? Math.max(...INITIAL_TASKS.map(t => t.id)) + 1 : 1;
    const newTask = { id: nextId, title, done: false };
    INITIAL_TASKS.push(newTask);
    res.status(201).json(newTask);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
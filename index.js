const express = require("express");

const app = express();

app.use(express.json());

const PORT = 3000;

let tasks = [
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
    res.status(200).json(tasks);
});

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task id" });
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }

    res.status(200).json(task);
});

app.post("/tasks", (req, res) => {
    const { title } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ error: "Invalid task title" });
    }

    const nextId = tasks.length > 0 
        ? Math.max(...tasks.map(task => task.id)) + 1 
        : 1;

    const newTask = { 
        id: nextId, 
        title: title.trim(), 
        done: false 
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task id" });
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }

    const { title, done } = req.body;

    if (title !== undefined) {
        if (typeof title !== "string" || title.trim() === "") {
            return res.status(400).json({ error: "Invalid task title" });
        }

        task.title = title.trim();
    }

    if (done !== undefined) {
        if (typeof done !== "boolean") {
            return res.status(400).json({ error: "Invalid task done status" });
        }

        task.done = done;
    }

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid task id" });
    }

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: `Task ${id} not found` });
    }

    tasks.splice(taskIndex, 1);

    return res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
import axios from "axios";
import express from "express";
const router = express.Router();
import fs from 'fs';
import path from 'path';

router.use('/meos', (req, res) => {
    fs.readFile(path.join(__dirname, "templates/todos.html"), 'utf-8', async (err, data) => {
        if (err) {
            return res.send("Load ui error")
        }

        let tableContent = ``;

        let meos;

        await axios.get("http://localhost:3000/api/v1/meos")
            .then(res => {
                meos = res.data.data;
            })
            .catch(err => {
                meos = [];
            })

        meos.map((meo, index) => {
            tableContent += `
                  <li class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;  display: flex; justify-content: space-between;">
                    <div>
                      <input class="form-check-input me-2" type="checkbox" value="" onchange="updateTodoStatus(event, ${meo.id})" aria-label="..." ${meo.completed ? 'checked' : ''} />
                      <span class="${meo.completed ? 'completed' : ''}" style="${meo.completed ? 'text-decoration: line-through;' : ''}">${meo.title}</span>
                    </div> 
                    <button onclick="deleteMeo(event, ${meo.id})" type="button" class="btn btn-danger">Delete</button>
                  </li>`;
        });




        res.send(data.replace("{{tableContent}}", tableContent));
    })
})



module.exports = router;
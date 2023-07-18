import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';
import multiparty from 'multiparty';

router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lấy meos thất bại!"
            })
        }
        return res.status(200).json({
            message: "Lấy meos thành công!",
            data: JSON.parse(data)
        })
    })
})

router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                })
            }
            let todos = JSON.parse(data);
            todos = todos.filter(todo => todo.id != req.params.id);

            fs.writeFile(path.join(__dirname, "meo.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    })
                }
                return res.status(200).json({
                    message: "Xóa todo thành công"
                })
            })
        })
    } else {
        return res.status(500).json({
            message: "Vui lòng truyền meoId!"
        })
    }
})

router.post('/', (req, res) => {
    //import multiparty from 'multiparty';
    let form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send("Lỗi đọc form!")
        }
        console.log("fields", fields)

        let newTodo = {
            id: Date.now(),
            title: fields.title[0],
            completed: false
        }

        fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Đọc dữ liệu thất bại!"
                    }
                )
            }

            let oldData = JSON.parse(data);
            oldData.unshift(newTodo)

            fs.writeFile(path.join(__dirname, "meo.json"), JSON.stringify(oldData), (err) => {
                if (err) {
                    return res.status(500).json(
                        {
                            message: "Ghi file thất bại!"
                        }
                    )
                }
                return res.redirect('/meos')
            })
        })
    })
})

router.patch('/:id', (req, res) => {
    if (req.params.id) {
        let flag = false;
        fs.readFile(path.join(__dirname, "meo.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy todos thất bại!"
                });
            }
            let todos = JSON.parse(data);

            todos = todos.map(todo => {
                if (todo.id == req.params.id) {
                    flag = true;
                    todo.completed = true;
                    return {
                        ...todo,
                        ...req.body
                    };
                }
                return todo;
            });

            fs.writeFile(path.join(__dirname, "meo.json"), JSON.stringify(todos), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    });
                }
                const pendingTasks = todos.filter(todo => !todo.completed);
                const number = pendingTasks.length;

                return res.status(200).json({
                    message: "Patch todo thành công",
                    number: number
                });
            });
        });
    }
});


module.exports = router;
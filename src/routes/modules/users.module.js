import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';


router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lấy users thất bại!"
            })
        }
        if (req.query.id) {
            let users = JSON.parse(data)
            let user = users.find(user => user.id == req.query.id)
            if (user) {
                return res.status(200).json({
                    message: "Lay user thanh cong!",
                    data: user
                })
            } else {
                return res.status(500).json({
                    message: `khong tim thay user co id ${req.query.id}`
                })
            }

        }
        return res.status(200).json({
            message: "Lấy users thành công!",
            data: JSON.parse(data)
        })
    })
})



router.post('/', (req, res) => {
    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json(
                {
                    message: "Đọc dữ liệu thất bại!"
                }
            )
        }
        let newUser = {
            id: Date.now(),
            ...req.body
        }
        let oldData = JSON.parse(data);
        oldData.unshift(newUser)
        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(oldData), (err) => {
            if (err) {
                return res.status(500).json(
                    {
                        message: "Ghi file thất bại!"
                    }
                )
            }
            return res.status(200).json({
                message: "Add user thanh cong",
                data: newUser
            })
        })
    })
})


router.put('/:usersId', (req, res) => {
    if (!req.params.usersId) {
        return res.status(500).json({
            message: "Vui long truyen usersId ban muon update"
        })
    }
    let usersId = req.params.usersId;
    let body = req.body;

    fs.readFile(path.join(__dirname, "users.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lay users that bai"
            });
        }

        let users = JSON.parse(data);
        let user = users.find(post => post.id == usersId);
        if (!user) {
            return res.status(500).json({
                message: "Khong tim thay users voi id" + usersId
            });
        }
        Object.assign(user, body);

        fs.writeFile(path.join(__dirname, "users.json"), JSON.stringify(users), (err) => {
            if (err) {
                return res.status(500).json({
                    message: "Luu file that bai"
                });
            }
            res.sendStatus(200);
        })
    })
})


router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy posts thất bại!"
                })
            }
            let todos = JSON.parse(data);
            todos = todos.filter(todo => todo.id != req.params.id);

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(todos), (err) => {
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
            message: "Vui lòng truyền postsId!"
        })
    }
})

module.exports = router;
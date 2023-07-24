import express from 'express';
const router = express.Router();
import fs from 'fs';
import path from 'path';


router.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lấy posts thất bại!"
            })
        }
        if (req.query.id) {
            let posts = JSON.parse(data)
            let user = posts.find(user => user.id == req.query.id)
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
            message: "Lấy posts thành công!",
            data: JSON.parse(data)
        })
    })
})



router.post('/', (req, res) => {
    fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Lấy posts thất bại!"
            })
        }

        let posts = JSON.parse(data)

        if (posts.length >= 10) {
            let lastUser = posts[posts.length - 1];
            let newUserId = parseInt(lastUser.userId) + 1;

            let newPost = {
                userId: newUserId.toString(),
                title: req.body.title,
                body: req.body.body
            }

            newPost.id = Date.now();

            posts.push(newPost)
            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), 'utf-8', (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Thêm mới post thất bại!"
                    })
                }
                return res.status(201).json({
                    message: "Thêm mới post thành công!",
                    data: newPost
                })
            })
        } else {
            let newPost = {
                userId: req.body.userId,
                title: req.body.title,
                body: req.body.body
            }
            newPost.id = Date.now();

            posts.push(newPost)

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), 'utf-8', (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Thêm mới post thất bại!"
                    })
                }
                return res.status(201).json({
                    message: "Thêm mới post thành công!",
                    data: newPost
                })
            })
        }
    })
})


router.put('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy posts thất bại!"
                });
            }
            let posts = JSON.parse(data);

            posts = posts.map(todo => {
                if (todo.id == req.params.id) {
                    return {
                        ...todo,
                        ...req.body
                    };
                }
                return todo;
            });

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Lưu file thất bại!"
                    });
                }
                const pendingTasks = posts.filter(todo => !todo.completed);
                const number = pendingTasks.length;

                return res.status(200).json({
                    message: "Patch todo thành công",
                    number: number
                });
            });
        });
    }
});


router.delete('/:id', (req, res) => {
    if (req.params.id) {
        fs.readFile(path.join(__dirname, "posts.json"), 'utf-8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    message: "Lấy posts thất bại!"
                })
            }
            let posts = JSON.parse(data);
            posts = posts.filter(todo => todo.id != req.params.id);

            fs.writeFile(path.join(__dirname, "posts.json"), JSON.stringify(posts), (err) => {
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
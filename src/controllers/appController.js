const appService = require('../services/appService')
const db = require('../models/index')

let getAllCodeByType = async (req, res) => {
    try {
        let { type } = req.query
        if (!type) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getAllCodeByType(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getAllBookByCategory = async (req, res) => {
    try {
        let { categoryId } = req.query
        if (!categoryId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getAllBookByCategory(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getOutStandingBook = async (req, res) => {
    try {

        let response = await appService.getOutStandingBook(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getInforBookById = async (req, res) => {
    try {
        if (!req.query.id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getInforBookById(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}


let postOneMessageByRoom = async (req, res) => {
    try {
        let { roomId, content, time } = req.body
        if (!roomId || !content || !time) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.postOneMessageByRoom({ ...req.body, userId: req.userId })
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let deleteOneMessageByRoom = async (req, res) => {
    try {
        let { id } = req.query
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.deleteOneMessageByRoom({ ...req.query, userId: req.userId })
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let updateOneMessageByRoom = async (req, res) => {
    try {
        let { id, content, time } = req.body
        if (!id || !content || !time) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.updateOneMessageByRoom({ ...req.body, userId: req.userId })
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}


let getAllMessageByRoomId = async (req, res) => {
    try {
        if (!req.query.roomId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing paramter",
                messageVI: "thiếu thông tin chuyền lên"
            })
        }
        let comments = await db.Comment.findAll({
            where: { roomId: req.query.roomId },
            include: [
                { model: db.User, as: "userCommentData", attributes: ['firstName', 'lastName', 'image', 'genderId', 'id', 'roleId'] }
            ],
            order: [['createdAt', 'DESC']]
        })
        if (comments) {
            comments = comments.map(item => {
                if (item.userCommentData.image) {
                    item.userCommentData.image = new Buffer(item.userCommentData.image, 'base64').toString('binary')
                }
                return item
            })
            return res.status(200).json({
                errCode: 0,
                messageEN: "Get comment successfully",
                messageVI: "Lấy thông tin comment thành công",
                data: comments
            })
        } else {
            return res.status(200).json({
                errCode: 0,
                messageEN: "Get comment failure",
                messageVI: "Lấy thông tin comment thất bại"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: "Error from to server",
            messageVI: "Có lỗi tử phía server"
        })
    }
}

let getLengthListBook = async (req, res) => {
    try {
        let { categoryId } = req.query
        if (!categoryId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getLengthListBook(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getInforAuthorById = async (req, res) => {
    try {
        let { id } = req.query
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getInforAuthorById(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getBookOfAuthorByAuthorId = async (req, res) => {
    try {
        let { authorId } = req.query
        if (!authorId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.getBookOfAuthorByAuthorId(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let searchBookOrAuthor = async (req, res) => {
    try {
        let { searchContent } = req.query
        if (!searchContent) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.searchBookOrAuthor(req.query)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

module.exports = {
    getBookOfAuthorByAuthorId,
    updateOneMessageByRoom,
    getInforAuthorById,
    getAllCodeByType,
    deleteOneMessageByRoom,
    postOneMessageByRoom,
    searchBookOrAuthor,
    getAllBookByCategory,
    getOutStandingBook,
    getLengthListBook,
    getInforBookById,
    getAllMessageByRoomId,
}
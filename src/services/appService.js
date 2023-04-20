const db = require('../models/index')
const { Op } = require("sequelize");
require('dotenv').config()

let getAllCodeByType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataSelect = await db.Allcode.findAll({
                where: { type: data.type }
            })
            if (dataSelect) {
                resolve({
                    errCode: 0,
                    data: dataSelect
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get information failure !!!",
                    messageVI: "Lấy thông tin thất bại !!!"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllBookByCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { categoryId, limit, page } = data
            let offset = page ? (20 * (+page - 1)) : 0
            let books = await db.Book.findAll({
                where: { categoryId: categoryId },
                include: [
                    { model: db.Author, as: "authorData", attributes: ['name'] }
                ],
                order: [['createdAt', 'DESC']],
                offset: offset,
                limit: limit ? +limit : null,
                nest: true
            })
            if (!books) {
                resolve({
                    errCode: -1,
                    messageEN: "Get list book failure",
                    messageVI: "Lấy danh sách sách thất bại"
                })
            } else {
                books = books.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary')
                    }
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get list book successfully",
                    messageVI: "Lấy danh sách sách thành công",
                    data: books
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getOutStandingBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let books = await db.Book.findAll({
                limit: 8,
                where: { borrowed: { [Op.ne]: 0 } },
                order: [
                    ['borrowed', 'DESC']
                ],
                include: [
                    { model: db.Author, as: 'authorData', attributes: ['name'] }
                ]

            })
            if (!books) {
                resolve({
                    errCode: -1,
                    messageEN: "Get list book failure",
                    messageVI: "Lấy danh sách sách được mượn nhiều nhất thất bại"
                })
            } else {
                books = books.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary')
                    }
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get list book successfully",
                    messageVI: "Lấy danh sách sách được mượn nhiều nhất thành công",
                    data: books
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getInforBookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let inforBook = await db.Book.findOne({
                where: { id: data.id },
                include: [
                    { model: db.Book_Infor, as: "bookInforData", include: [{ model: db.Shelf, as: "shelfData", attributes: ['name'] }] },
                    { model: db.Author, as: "authorData", attributes: ['name'] },
                ],
                nest: true
            })
            if (!inforBook) {
                resolve({
                    errCode: 1,
                    messageEN: "Get information book failure",
                    messageVi: "Lấy thông tin sách thất bại"
                })
            } else {
                if (inforBook.image) {

                    inforBook.image = new Buffer(inforBook.image, 'base64').toString('binary')
                }

                resolve({
                    errCode: 0,
                    messageEN: "Get information book successfully",
                    messageVi: "Lấy thông tin sách thành công",
                    data: inforBook
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


let postOneMessageByRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { roomId, userId, parentId, content, time } = data
            let check = await db.Comment.create({
                roomId: roomId,
                userId: userId,
                parentId: parentId,
                content: content,
                time: time
            })
            if (!check) {
                resolve({
                    errCode: -1,
                    messageEN: "Post message failure",
                    messageVI: "Gửi tin nhắn sách thất bại"
                })
            } else {

                resolve({
                    errCode: 0,
                    messageEN: "Post message successfully",
                    messageVI: "Gửi tin nhắn sách thành công",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteOneMessageByRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id, userId } = data
            let checkExist = await db.Comment.findOne({
                where: { id: id, userId: userId }
            })
            let checkChildComment = await db.Comment.findAll({
                where: { parentId: id }
            })
            if (!checkExist) {
                resolve({
                    errCode: -1,
                    messageEN: "Message not found",
                    messageVI: "Tin nhắn Không được tìm thấy"
                })
            } else {
                let check = await checkExist.destroy()
                checkChildComment.map(async item => {
                    await item.destroy()
                })
                if (!check) {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete Message successfully",
                        messageVI: "Xóa tin nhắn sách thất bại",
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete Message successfully",
                        messageVI: "Xóa tin nhắn sách thành công",
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}


let updateOneMessageByRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id, content, time, userId } = data
            let checkExist = await db.Comment.findOne({
                where: { id: id, userId: userId }
            })
            if (!checkExist) {
                resolve({
                    errCode: 1,
                    messageEN: "Comment not found",
                    messageVI: "Không tìm thấy comment"
                })
            } else {
                checkExist.content = content
                checkExist.time = time
                let check = await checkExist.save()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update comment successfully",
                        messageVI: "Cập nhật bình luận thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Update comment failure",
                        messageVI: "Cập nhật bình luận thất bại"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getLengthListBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { categoryId } = data
            let listBooks = await db.Book.findAll({ where: { categoryId: categoryId } })
            if (listBooks) {
                resolve({
                    errCode: 0,
                    messageEN: "Get leng list Book successfully",
                    massageVI: "Lấy số lượng sách thành công",
                    data: listBooks.length
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get leng list Book failure",
                    massageVI: "Lấy số lượng sách thất bại",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getInforAuthorById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let author = await db.Author.findOne({
                where: { id: id },
                include: [{ model: db.Allcode, as: 'genderAuthorData', attributes: ['valueEn', 'valueVi'] }],
                nest: true
            })
            if (author) {
                if (author.image) {
                    author.image = new Buffer(author.image, 'base64').toString('binary')
                }
                resolve({
                    errCode: 0,
                    messageEN: "Get Infor author successfully",
                    messageVI: "Lấy thông tin tác giả thành công",
                    data: author
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get Infor author failure",
                    messageVI: "Lấy thông tin tác giả thất bại",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getBookOfAuthorByAuthorId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { authorId } = data
            let books = await db.Book.findAll({ where: { authorId: authorId } })
            if (books) {
                books = books.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary')
                    }
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get list books of author successfully",
                    messageVI: "Lấy thông tin danh sách sách của tác giả thành công",
                    data: books
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get books of author failure",
                    messageVI: "Lấy thông tin danh sách sách của tác giả thất bại",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let searchBookOrAuthor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { searchContent } = data
            let books = await db.Book.findAll({
                where: { name: { [Op.like]: `%${searchContent}%` } },
                attributes: ['name', 'id']
            })
            let authors = await db.Author.findAll({
                where: { name: { [Op.like]: `%${searchContent}%` } },
                attributes: ['name', 'id']
            })
            let categories = await db.Allcode.findAll({
                where: { type: 'CATEGORY', [Op.or]: [{ valueEn: { [Op.like]: `%${searchContent}%` } }, { valueVi: { [Op.like]: `%${searchContent}%` } }] },
                attributes: ['valueEn', 'valueVi', 'keyMap']
            })
            if (books || authors || categories) {
                let options = []

                if (books && books.length > 0) {
                    books.map(item => {
                        options.push({
                            type: 'book',
                            bookId: item.id,
                            label: item.name
                        })
                    })
                }

                if (categories && categories.length > 0) {
                    categories.map(item => {
                        options.push({
                            type: 'category',
                            categoryId: item.keyMap,
                            label: item.valueVi + ' ' + item.valueEn
                        })
                    })
                }

                if (authors && authors.length > 0) {
                    authors.map(item => {
                        options.push({
                            type: 'author',
                            authorId: item.id,
                            label: item.name
                        })
                    })
                }
                resolve({
                    errCode: 0,
                    messageEN: "Get option search successfully",
                    messageVI: "Lấy lựa chọn tìm kiếm thành công",
                    data: options
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get option search failure",
                    messageVI: "Lấy lựa chọn tìm kiếm thất bại",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    getBookOfAuthorByAuthorId,
    searchBookOrAuthor,
    getInforAuthorById,
    updateOneMessageByRoom,
    getAllCodeByType,
    getAllBookByCategory,
    getOutStandingBook,
    getInforBookById,
    postOneMessageByRoom,
    deleteOneMessageByRoom,
    getLengthListBook,
}
const systemService = require('../services/systemService')

let getAllHistory = async (req, res) => {
    try {
        let response = await systemService.getAllHistory()
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

let getAllUser = async (req, res) => {
    try {
        let response = await systemService.getAllUser()
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


let addNewUser = async (req, res) => {
    try {
        let { email, password, firstName, lastName, address, phoneNumber, genderId, roleId } = req.body;

        if (!email || !password || !firstName || !lastName || !phoneNumber || !address || !genderId || !roleId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.addNewUser(req.body)
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

let getUserByRole = async (req, res) => {
    try {
        let { roleId } = req.query;

        if (!roleId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.getUserByRole(req.query)
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


let updateUserById = async (req, res) => {
    try {
        let { firstName, lastName, address, phoneNumber, genderId, roleId } = req.body;
        let { id } = req.query

        if (!firstName || !lastName || !address || !genderId || !phoneNumber || !id || !roleId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateUserById({ ...req.body, ...req.query })
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

let deleteUserById = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.deleteUserById(req.query)
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

// book

let getAllBook = async (req, res) => {
    try {
        let response = await systemService.getAllBook()
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

let addNewBook = async (req, res) => {
    try {
        let { name, image, categoryId, authorId, quantity, shelfId, roomId, description } = req.body;

        if (!name || !image || !authorId || !categoryId || !quantity || !shelfId || !roomId || !description) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.addNewBook(req.body)
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

let getBookByCategory = async (req, res) => {
    try {
        let { category } = req.query;

        if (!category) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.getBookByCategory(req.query)
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

let updateBookById = async (req, res) => {
    try {
        let { name, image, authorId, categoryId, quantity, shelfId, roomId, description } = req.body;
        let { id } = req.query
        if (!name || !image || !authorId || !categoryId || !quantity || !id || !shelfId || !roomId || !description) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateBookById({ ...req.body, ...req.query })
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

let deleteBookById = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.deleteBookById(req.query)
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

//author

let addNewAuthor = async (req, res) => {
    try {
        let { name, genderId, birthDay, description } = req.body;
        if (!name || !genderId || !birthDay || !description) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.addNewAuthor(req.body)
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

let getAllAuthor = async (req, res) => {
    try {
        let response = await systemService.getAllAuthor()
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

let updateAuthorById = async (req, res) => {
    try {
        let { name, image, birthDay, description, genderId } = req.body;
        let { id } = req.query

        if (!name || !birthDay || !description || !id || !genderId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateAuthorById({ ...req.body, ...req.query })
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

let deleteAuthorById = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.deleteAuthorById(req.query)
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

//shelf

let addNewShelf = async (req, res) => {
    try {
        let { name, location, description } = req.body;

        if (!name || !location || !description) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.addNewShelf(req.body)
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

let getAllShelf = async (req, res) => {
    try {
        let response = await systemService.getAllShelf()
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

let updateShelfById = async (req, res) => {
    try {
        let { name, location, description } = req.body;
        let { id } = req.query

        if (!name || !location || !description || !id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateShelfById({ ...req.body, ...req.query })
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

let deleteShelfById = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.deleteShelfById(req.query)
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


let getListCartToManage = async (req, res) => {
    try {

        let response = await systemService.getListCartToManage()
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

let createNewTransaction = async (req, res) => {
    try {
        let { firstName, lastName, address, phoneNumber, returnDate, bookId, time } = req.body;

        if (!firstName || !lastName || !address || !phoneNumber || !returnDate || !bookId || !time) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.createNewTransaction(req.body)
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

let updateOneTransaction = async (req, res) => {
    try {
        let { cartId, userId, firstName, lastName, address, phoneNumber, returnDate } = req.body;

        if (!cartId || !userId || !firstName || !lastName || !address || !phoneNumber || !returnDate) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateOneTransaction(req.body)
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

let confirmOneTransactionSuccess = async (req, res) => {
    try {
        let { cartId, userId, bookId, borrowDate, returnDate } = req.body;

        if (!cartId || !userId || !bookId || !returnDate || !borrowDate) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.confirmOneTransactionSuccess(req.body)
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


let updateCartBorrowSuccess = async (req, res) => {
    try {
        let { cartId, userId, time, bookId } = req.body;

        if (!cartId || !userId || !time || !bookId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.updateCartBorrowSuccess(req.body)
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

let getHistoryByTime = async (req, res) => {
    try {
        let { startDate, endDate } = req.query
        if (!startDate || !endDate) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await systemService.getHistoryByTime(req.query)
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
    getUserByRole,
    getHistoryByTime,
    confirmOneTransactionSuccess,
    updateOneTransaction,
    createNewTransaction,
    updateUserById,
    getListCartToManage,
    deleteUserById,
    addNewUser,
    deleteBookById,
    updateCartBorrowSuccess,
    updateBookById,
    getBookByCategory,
    addNewBook,
    addNewAuthor,
    getAllAuthor,
    updateAuthorById,
    deleteAuthorById,
    addNewShelf,
    getAllShelf,
    updateShelfById,
    deleteShelfById,
    getAllUser,
    getAllBook,
    getAllHistory,
}
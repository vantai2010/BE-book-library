const userService = require('../services/userService')
const isEmail = require('isemail')
const db = require('../models/index')

let registerAccount = async (req, res) => {
    try {
        let { email, password, rePassword, language, link } = req.body;
        let arrInput = ['email', 'password', 'rePassword']
        for (let i = 0; i < arrInput.length; i++) {
            if (req.body[arrInput[i]] === undefined) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: `Missing enter ${arrInput[i]} in request `,
                    messageVI: `Bạn chưa nhập ${arrInput[i]} `
                })
            }
        }
        if (!isEmail.validate(email)) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Invalid email input",
                messageVI: "Email nhập không hợp lệ"
            })
        }
        if (password !== rePassword) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Retype password is incorrect ",
                messageVI: "Mật khẩu nhập lại không chính xác "
            })
        }
        if (!language || !link) {
            return res.status(200).json({
                errCode: 2,
                messageEN: "Missing information in request",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }

        let response = await userService.registerAccount(req.body)
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

let registerExraInfor = async (req, res) => {
    try {
        let { email, firstName, lastName, phoneNumber, address, genderId } = req.body;
        if (!email || !firstName || !lastName || !phoneNumber || !address || !genderId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.registerExraInfor(req.body)
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

let loginAccount = async (req, res) => {
    try {
        let { email, password } = req.body;
        let arrInput = ['email', 'password']
        for (let i = 0; i < arrInput.length; i++) {
            if (req.body[arrInput[i]] === undefined) {
                return res.status(200).json({
                    errCode: 1,
                    messageEN: `Missing enter ${arrInput[i]} in request `,
                    messageVI: `Bạn chưa nhập ${arrInput[i]} chuyền lên `
                })
            }
        }
        if (!isEmail.validate(email)) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Invalid email input",
                messageVI: "Email nhập không hợp lệ"
            })
        }
        let response = await userService.loginAccount(req.body)
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


let handleForgotPassword = async (req, res) => {
    try {
        let { email, phoneNumber, newPassword, reNewPassword } = req.body;
        if (!email || !newPassword || !reNewPassword || !phoneNumber) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }

        if (newPassword !== reNewPassword) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Re Enter password incorrect",
                messageVI: "Mật khẩu nhập lại không chính xác"
            })
        }

        let response = await userService.handleForgotPassword(req.body)
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

let sendEmailForgotPassword = async (req, res) => {
    try {
        let { email } = req.body;

        if (!email) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Please enter your email to retrieve your password",
                messageVI: "Vui lòng nhập email để lấy lại mật khẩu"
            })
        }
        let response = await userService.sendEmailForgotPassword(req.body)
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

let getInforAccount = async (req, res) => {
    try {
        let user = await db.User.findOne({
            where: { id: req.userId, roleId: req.roleId },
            raw: true
        })
        if (!user) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "User isn't exist",
                messageVI: "Người dùng không tồn tại"
            })
        } else {
            if (user.image) {
                user.image = new Buffer(user.image, 'base64').toString('binary')
            }
            delete user.password
            return res.status(200).json({
                errCode: 0,
                messageEN: "Login successfully",
                messageVI: "Đăng nhập thành công",
                user
            })

        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let getAllCart = async (req, res) => {
    try {

        let response = await userService.getAllCart(req)
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


let deleteOneCart = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.deleteOneCart(req.query)
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


let getAllNotifycation = async (req, res) => {
    try {
        let response = await userService.getAllNotifycation(req)
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

let addOneNotifycation = async (req, res) => {
    try {
        let { titleId, messageEn, messageVi, receiverId } = req.body;

        if (!titleId || !messageEn || !messageVi || !receiverId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.addOneNotifycation(req.body)
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


let deleteOneNotifycation = async (req, res) => {
    try {
        let { id } = req.query;

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.deleteOneNotifycation(req.query)
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

let addOneCart = async (req, res) => {
    try {
        let { bookId, time } = req.body

        if (!bookId || !time) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.addOneCart({ ...req.body, userId: req.userId })
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}

let borrowNowCart = async (req, res) => {
    try {
        let { bookId, time, returnDate } = req.body

        if (!bookId || !time || !returnDate) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.borrowNowCart({ ...req.body, userId: req.userId })
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

let addOneNotifycationSocket = async (req, res) => {
    try {
        let { titleId, messageEn, messageVi, receiverId } = req.body;

        if (!titleId || !messageEn || !messageVi || !receiverId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        console.log('da chay vao api socket')
        let response = await userService.addOneNotifycationSocket(req.body)
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

let deleteOneNotifycationSocket = async (req, res) => {
    try {
        let { senderId, message } = req.query;

        if (!senderId || !message) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.deleteOneNotifycationSocket(req.query)
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

let editExtraInfor = async (req, res) => {
    try {
        let { firstName, lastName, phoneNumber, address, genderId } = req.body;

        if (!firstName || !lastName || !phoneNumber || !address || !genderId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.editExtraInfor({ ...req.body, userId: req.userId })
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

let changePassword = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.changePassword({ ...req.body, userId: req.userId })
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

let getAllCartByStatusId = async (req, res) => {
    try {
        let { statusId } = req.query;
        if (!statusId) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await userService.getAllCartByStatusId({ ...req.query, userId: req.userId })
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
    getAllCart,
    getAllCartByStatusId,
    changePassword,
    editExtraInfor,
    addOneNotifycationSocket,
    deleteOneNotifycationSocket,
    addOneCart,
    registerAccount,
    loginAccount,
    registerExraInfor,
    addOneNotifycation,
    handleForgotPassword,
    sendEmailForgotPassword,
    getInforAccount,
    deleteOneCart,
    getAllNotifycation,
    deleteOneNotifycation,
    borrowNowCart,
}
const db = require('../models/index')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const emailService = require('./emailService')
require('dotenv').config()

let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let emailCheck = await db.User.findOne({
                where: { email: email }
            })
            if (!emailCheck) {
                resolve(false)
            } else {
                resolve(emailCheck)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let registerAccount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, password, language, link } = data
            let emailCheck = await checkEmail(email)
            if (emailCheck) {
                resolve({
                    errCode: 1,
                    messageEN: "Email is exist ",
                    messageVI: "Email này đã tồn tại "
                })
            } else {
                passwordHashed = await argon2.hash(password);
                let check = await db.User.create({
                    email: email,
                    password: passwordHashed,
                    roleId: data.roleId ? data.roleId : 'R2'
                })
                if (check) {
                    await emailService.sendEmailRegister({ reciverEmail: email, language, link })
                    resolve({
                        errCode: 0,
                        messageEN: "Create new Accoount successfully, Please check your email to continue with the registration procedure ",
                        messageVI: "Thêm tài khoản mới thành công, Bạn vui lòng kiểm tra email để tiếp tục thủ tục đăng ký "
                    })
                } else {
                    resolve({
                        errCode: 2,
                        messageEN: "Create new Accoount failure ",
                        messageVI: "Thêm tài khoản mới thất bại "
                    })
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}


let loginAccount = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, password } = data
            let emailCheck = await db.User.findOne({
                where: { email },
                raw: true
            })
            if (emailCheck) {
                if (!emailCheck.firstName || !emailCheck.lastName || !emailCheck.address || !emailCheck.phoneNumber || !emailCheck.genderId) {
                    resolve({
                        errCode: 1,
                        messageEN: 'Your account has not been verified by you, please check your email to verify your information to complete account registration',
                        messageVI: "Tài khoản của bạn chưa được bạn xác thực thông tin, vui lòng check mail để xác thực thông tin để hoàn tất đăng ký tài khoản"
                    })
                } else {

                    let checkPassword = await argon2.verify(emailCheck.password, password)
                    let token = jwt.sign({ userId: emailCheck.id, roleId: emailCheck.roleId }, process.env.ACCESS_TOKEN_SECRET)
                    if (emailCheck.image) {
                        emailCheck.image = new Buffer(emailCheck.image, 'base64').toString('binary')
                    }
                    delete emailCheck.password
                    if (checkPassword) {
                        resolve({
                            errCode: 0,
                            messageEN: "Login successfully ",
                            messageVI: "Đăng nhập thành công ",
                            user: emailCheck,
                            token: token
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Login failed please re enter password ",
                            messageVI: "Đăng nhập thất bại vui lòng nhập lại password "
                        }
                        )
                    }
                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Email's account isn't Exist ",
                    messageVI: "Tài khoản của email này không tồn tại  "
                })
            }


        } catch (error) {
            reject(error);
        }
    })
}


let registerExraInfor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, firstName, lastName, phoneNumber, address, genderId, image } = data
            let emailCheck = await checkEmail(email)
            if (emailCheck) {
                emailCheck.firstName = firstName
                emailCheck.lastName = lastName
                emailCheck.phoneNumber = phoneNumber
                emailCheck.address = address
                emailCheck.genderId = genderId
                emailCheck.image = image

                let check = await emailCheck.save()
                if (check) {
                    let token = jwt.sign({ email: email, roleId: 'R2' }, process.env.ACCESS_TOKEN_SECRET)
                    resolve({
                        errCode: 0,
                        messageEN: 'Register account successfully',
                        messageVI: "Đăng ký tài khoản thành công",
                        token
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: 'Register account failure',
                        messageVI: "Đăng ký tài khoản thất bại"
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: 'Register account failure',
                    messageVI: "Đăng ký tài khoản thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, phoneNumber, newPassword } = data
            let emailCheck = await db.User.findOne({
                where: { email, phoneNumber }
            })
            if (emailCheck) {
                let newPassWordHashed = await argon2.hash(newPassword)
                emailCheck.password = newPassWordHashed
                let check = await emailCheck.save()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Reset password successfully",
                        messageVI: "Thay đổi mật khẩu thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Reset password failed",
                        messageVI: "Thay đổi mật khẩu thất bại"
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Account isn't exist",
                    messageVI: "Tài khoản này không tồn tại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let sendEmailForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, language } = data
            let emailCheck = await checkEmail(email)
            if (emailCheck) {
                await emailService.sendEmailForgotPassword({ reciverEmail: email, phoneNumber: emailCheck.phoneNumber, language: language })
                resolve({
                    errCode: 0,
                    messageEN: "Please check your email to continue with the forgotten password procedure",
                    messageVI: "Vui lòng kiểm tra email để tiếp tục thủ tục quên mật khẩu"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Account's email isn't exist",
                    messageVI: "Tài khoản của email này không tồn tại"
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

let getAllCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId } = data
            let carts = await db.Cart.findAll({
                where: { userId: userId, statusId: 'IN' },
                include: [
                    {
                        model: db.Book, as: "bookCartData", attributes: ['name', 'image'],
                        include: [{ model: db.Author, as: 'authorData', attributes: ['name'] }]
                    }
                ]
            })
            if (carts) {
                carts = carts.map(item => {
                    if (item.bookCartData.image) {
                        item.bookCartData.image = new Buffer(item.bookCartData.image, 'base64').toString('binary')
                    }
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get cart successfully",
                    messageVI: "Lấy danh sách cart thành công",
                    data: carts
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get cart failure",
                    messageVI: "Lấy danh sách cart thất bại"
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}


let deleteOneCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let checkCart = await db.Cart.findOne({ where: { id: id } })
            if (!checkCart) {
                resolve({
                    errCode: 1,
                    messageEN: "Cart not found",
                    messageVI: "Sản phẩm này không còn tồn tại"
                })
            } else {
                let check = await checkCart.destroy()
                if (!check) {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete cart failure",
                        messageVI: "Xóa sản phẩm khỏi giỏ thất bại"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete cart successfully",
                        messageVI: "Xóa sản phẩm khỏi giỏ thành công"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}



let getAllNotifycation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId } = data
            let checkExist = await db.Notifycation.findAll({
                where: { receiverId: userId },
                include: [
                    { model: db.Allcode, as: "notifyTitleData", attributes: ['valueVi', 'valueEn'] }
                ],
                order: [['createdAt', 'DESC']]
            })
            if (!checkExist) {
                resolve({
                    errCode: 1,
                    messageEN: "Notifycation not found",
                    messageVI: "Không tìm thấy thông báo nào"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get notifycation successfully",
                    messageVI: "Lấy danh sách thông báo thành công",
                    data: checkExist
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


let addOneNotifycation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { senderId, titleId, messageEn, messageVi, location, receiverId } = data
            let checkCreate = await db.Notifycation.create({
                senderId: senderId,
                messageEn: messageEn,
                messageVi: messageVi,
                titleId: titleId,
                location: location,
                receiverId: receiverId
            })
            if (checkCreate) {
                resolve({
                    errCode: 0,
                    messageEN: "Create notifycation successfully",
                    messageVI: "Tạo thông báo mới thành công"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Create notifycation failure",
                    messageVI: "Tạo thông báo mới thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addOneNotifycationSocket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { senderId, titleId, messageEn, messageVi, location, receiverId } = data
            let checkCreate = await db.Notifycation.create({
                senderId: senderId,
                messageEn: messageEn,
                messageVi: messageVi,
                titleId: titleId,
                receiverId: receiverId,
                location: location,
            })
            if (checkCreate) {
                resolve({
                    errCode: 0,
                    messageEN: "Create notifycation successfully",
                    messageVI: "Tạo thông báo mới thành công"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Create notifycation failure",
                    messageVI: "Tạo thông báo mới thất bại"
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}


let deleteOneNotifycation = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let checkExist = await db.Notifycation.findOne({ where: { id: id } })
            if (checkExist) {

                let check = await checkExist.destroy()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete notifycation successfully",
                        messageVI: "Xóa thông báo mới thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete notifycation failure",
                        messageVI: "Xóa thông báo mới thất bại"
                    })

                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Notifycation not found",
                    messageVI: "Thông báo không được tìm thấy"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addOneCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId, bookId, time } = data
            let checkCartDoing = await db.Cart.findOne({ where: { userId: userId, bookId: bookId, statusId: 'W' } })
            let checkBook = await db.Book.findOne({ where: { id: bookId } })
            if (!checkBook) {
                resolve({
                    errCode: -1,
                    messageEN: "This book not found",
                    messageVI: "Quyển sách này không tồn tại"
                })
            } else if (checkBook.quantity === 0) {
                resolve({
                    errCode: -1,
                    messageEN: "The book is currently out of stock",
                    messageVI: "Quyển sách hiện tại đã hết hàng"
                })
            } else if (checkCartDoing) {
                resolve({
                    errCode: 1,
                    messageEN: "This book you have requested to borrow and is in the process of being processed, so you cannot add this book to your cart",
                    messageVI: "Quyển sách này bạn đã yêu cầu mượn và đang trong quá trình sử lý nên bạn không thể thêm sách này vào giỏ",
                })
            } else if (!checkCartDoing) {
                let checkBookBorrowed = await db.Cart.findOne({ where: { userId: userId, bookId: bookId, statusId: 'B' } })
                if (checkBookBorrowed) {
                    resolve({
                        errCode: 1,
                        messageEN: "This book you have requested to borrow and is in the process of being borrowed, so you cannot add it to your cart",
                        messageVI: "Quyển sách này bạn đã yêu cầu mượn và đang trong quá trình mượn nên bạn không thể thêm vào giỏ "
                    })
                } else {
                    let checkExist = await db.Cart.findOne({
                        where: { userId: userId, bookId: bookId, statusId: 'IN' }
                    })
                    if (checkExist) {
                        resolve({
                            errCode: 1,
                            messageEN: "This Book is already in your cart",
                            messageVI: "Quyển sách này đã có trong giỏ hàng"
                        })
                    } else {
                        let checkNumber = await db.Cart.findAll({ where: { userId: userId, statusId: 'IN' } })
                        if (checkNumber.length >= 4) {
                            resolve({
                                errCode: 1,
                                messageEN: "Your cart is full",
                                messageVI: "Giỏ hàng đã đầy"
                            })
                        } else {

                            let check = await db.Cart.create({
                                userId: userId,
                                bookId: bookId,
                                time: time,
                                statusId: "IN"
                            })
                            if (!check) {
                                resolve({
                                    errCode: 1,
                                    messageEN: "Add book to cart failure",
                                    messageVI: "Thêm sách vào giỏ hàng thất bại"
                                })
                            } else {
                                resolve({
                                    errCode: 0,
                                    messageEN: "Add book to cart successfully",
                                    messageVI: "Thêm sách vào giỏ hàng thành công"
                                })
                            }
                        }
                    }
                }
            }


        } catch (error) {
            reject(error);
        }
    })
}

let borrowNowCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId, bookId, time, returnDate } = data
            let checkNumber = await db.Cart.findAll({ where: { userId: userId, statusId: 'B' } })
            let checkBook = await db.Book.findOne({ where: { id: bookId } })
            if (!checkBook) {
                resolve({
                    errCode: -1,
                    messageEN: "This book not found",
                    messageVI: "Quyển sách này không tồn tại"
                })
            } else if (checkBook.quantity === 0) {
                resolve({
                    errCode: -1,
                    messageEN: "The book is currently out of stock",
                    messageVI: "Quyển sách hiện tại đã hết hàng"
                })
            } else if (checkNumber && checkNumber.length >= 4) {
                resolve({
                    errCode: -1,
                    messageEN: "You can only borrow up to 4 books",
                    messageVI: "Bạn chỉ được mượn tối đa 4 quyển sách"
                })
            } else {

                let checkExist = await db.Cart.findOne({
                    where: { userId: userId, bookId: bookId }
                })
                if (!checkExist) {
                    let checkCreate = await db.Cart.create({
                        userId: userId,
                        bookId: bookId,
                        time: time,
                        returnDate: returnDate,
                        statusId: 'W'
                    })
                    if (checkCreate) {
                        resolve({
                            errCode: 0,
                            messageEN: "Your request has been fulfilled, please wait a few minutes for the staff to review your request to borrow books",
                            messageVI: "Yêu cầu của bạn đã được thực hiện vui lòng đợi vài phút để nhân viên xem sét yêu cầu mượn sách của bạn"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Your request has failed during submission, please check again or notify admin about your problem.",
                            messageVI: "Yêu cầu của bạn đã bị lỗi trong quá trình gửi đi vui lòng kiểm tra lại hoặc thông báo cho admin biết về vấn đề của bạn"
                        })
                    }

                } else if (checkExist && checkExist.statusId === 'B') {
                    resolve({
                        errCode: 1,
                        messageEN: "This book is in the process of borrowing, so you can't borrow it anymore",
                        messageVI: "Quyển sách này bạn đang trong quá trình mượn nên bạn không thể mượn tiếp "
                    })
                } else if (checkExist && checkExist.statusId === 'W') {
                    resolve({
                        errCode: 1,
                        messageEN: "Your request to borrow the book is already in the process of being processed, so you cannot borrow this book anymore",
                        messageVI: "Yêu cầu mượn sách của bạn đã trong quá trình sử lý nên bạn không thể mượn thêm sách này",
                    })
                } else if (checkExist && checkExist.statusId === 'IN') {
                    checkExist.statusId = 'W'
                    checkExist.time = time
                    checkExist.returnDate = returnDate
                    let checkUpdate = await checkExist.save()
                    if (checkUpdate) {
                        resolve({
                            errCode: 0,
                            messageEN: "Your request has been fulfilled, please wait a few minutes for the staff to review your request to borrow books",
                            messageVI: "Yêu cầu của bạn đã được thực hiện vui lòng đợi vài phút để nhân viên xem sét yêu cầu mượn sách của bạn"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Your request has failed during submission, please check again or notify admin about your problem.",
                            messageVI: "Yêu cầu của bạn đã bị lỗi trong quá trình gửi đi vui lòng kiểm tra lại hoặc thông báo cho admin biết về vấn đề của bạn"
                        })
                    }
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

let deleteOneNotifycationSocket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { senderId, message } = data
            let checkExist = await db.Notifycation.findOne({ where: { senderId: senderId, message: { [Op.like]: `%${message}%` } } })
            if (checkExist) {

                let check = await checkExist.destroy()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete notifycation successfully",
                        messageVI: "Xóa thông báo mới thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete notifycation failure",
                        messageVI: "Xóa thông báo mới thất bại"
                    })

                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Notifycation not found",
                    messageVI: "Thông báo không được tìm thấy"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let editExtraInfor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { firstName, lastName, phoneNumber, address, genderId, userId, image } = data
            let user = await db.User.findOne({ where: { id: userId } })
            if (user) {
                user.firstName = firstName
                user.lastName = lastName
                user.phoneNumber = phoneNumber
                user.address = address
                user.genderId = genderId
                user.image = image
                let check = await user.save()

                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update Information successfully",
                        messageVI: "Cập nhật thông tin thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Update Information failure",
                        messageVI: "Cập nhật thông tin thất bại"
                    })

                }
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "User not found",
                    messageVI: "Người dùng này không được tìm thấy"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let changePassword = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { oldPassword, newPassword, userId } = data;
            let user = await db.User.findOne({ where: { id: userId } })

            if (user) {
                let checkPass = await argon2.verify(user.password, oldPassword)
                if (!checkPass) {
                    resolve({
                        errCode: 1,
                        messageEN: 'The old password you passed is incorrect',
                        messageVI: "Mật khẩu cũ bạn chuyền không đúng"
                    })
                } else {
                    let passHashed = await argon2.hash(newPassword)
                    user.password = passHashed
                    let check = await user.save()
                    if (check) {
                        resolve({
                            errCode: 0,
                            messageEN: "Your password has been changed",
                            messageVI: "Mật khẩu của bạn đã được thay đổi"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Change your password failure",
                            messageVI: "Thay đổi mật khẩu thất bại"
                        })
                    }
                }
            } else {
                resolve({
                    errCode: -1,
                    messageEN: 'User not found',
                    messageVI: "Người dùng không được tìm thấy"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllCartByStatusId = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId, statusId } = data;
            let carts = await db.Cart.findAll({
                where: { statusId: statusId, userId: userId },
                include: [
                    {
                        model: db.Book, as: 'bookCartData', attributes: ['name', 'image', 'borrowed', 'quantity'],
                        include: [{ model: db.Author, as: 'authorData', attributes: ['name'] }]
                    }
                ]
            })
            if (carts) {
                if (carts && carts.length > 0) {
                    carts = carts.map(item => {
                        if (item.bookCartData.image) {
                            item.bookCartData.image = new Buffer(item.bookCartData.image, 'base64').toString('binary')
                        }
                        return item
                    })
                }
                resolve({
                    errCode: 0,
                    messageEN: "Get list cart successfully",
                    messageVI: "Lấy danh sách dỏ hàng thành công",
                    data: carts
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get list cart failure",
                    messageVI: "Lấy danh sách dỏ hàng thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    loginAccount,
    registerAccount,
    getAllCartByStatusId,
    editExtraInfor,
    registerExraInfor,
    deleteOneNotifycationSocket,
    changePassword,
    handleForgotPassword,
    sendEmailForgotPassword,
    getAllCart,
    deleteOneCart,
    getAllNotifycation,
    addOneNotifycation,
    deleteOneNotifycation,
    addOneCart,
    borrowNowCart,
    addOneNotifycationSocket,
}
const db = require('../models/index')
const argon2 = require('argon2')
const { Op } = require('sequelize')
const moment = require('moment')

let getAllHistory = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let histories = await db.History.findAll({
                include: [
                    { model: db.User, as: 'userData', attributes: ['firstName', 'lastName', 'phoneNumber'] },
                    {
                        model: db.Book, as: 'bookHistoryData',
                        include: [{ model: db.Author, as: 'authorData' }]
                    }
                ]
            })
            if (histories) {
                resolve({
                    errCode: 0,
                    messageEN: "Get history successfully",
                    messageVI: "Lấy thông tin lịch sử thành công",
                    data: histories
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get history failure",
                    messageVI: "Lấy thông tin lịch sử thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { email, password, firstName, lastName, phoneNumber, address, genderId, roleId, image } = data
            let checkEmail = await db.User.findOne({ where: { email: email } })
            if (checkEmail) {
                resolve({
                    errCode: 1,
                    messageEN: "Email is exist, please re renter",
                    messageVI: "Email đã được sử dụng vui lòng dùng email khác"
                })
            } else {

                let passwordHashed = await argon2.hash(password)
                let check = await db.User.create({
                    email: email,
                    password: passwordHashed,
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber,
                    address: address,
                    genderId: genderId,
                    image: image,
                    roleId: roleId
                })
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Create New user successfully",
                        messageVI: "Tạo người dùng mới thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageENmessageEN: "Create New user failure",
                        messageVI: "Tạo người dùng mới thất bại"
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
                include: [
                    { model: db.Allcode, as: 'genderUserData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: "roleData", attributes: ['valueEn', 'valueVi'] }
                ],
                nest: true
            })
            if (!users) {
                resolve({
                    errCode: 1,
                    messageEN: "No User",
                    messageVI: "Không có người dùng nào"
                })
            } else {
                if (users.length > 0) {
                    users = users.map(item => {
                        if (item.image) {
                            item.image = new Buffer(item.image, 'base64').toString('binary')
                        }
                        delete item.password
                        return item
                    })

                }
                resolve({
                    errCode: 0,
                    messageEN: "Get user successfully",
                    messageVI: "Lấy người dùng thành công",
                    data: users
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getUserByRole = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { roleId } = data
            let users = await db.User.findAll({
                where: { roleId: roleId }
            })
            if (!users || users.length === 0) {
                resolve({
                    errCode: 1,
                    messageEN: "No User",
                    messageVI: "Không có người dùng nào"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get User successfully",
                    messageVI: "Lấy người dùng thành công",
                    data: users
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUserById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { firstName, lastName, phoneNumber, address, genderId, id, roleId, image } = data
            let user = await db.User.findOne({
                where: { id: id }
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    messageEN: "User isn't exist",
                    messageVI: "Người dùng không tồn tại"
                })
            } else {
                user.firstName = firstName
                user.lastName = lastName
                user.phoneNumber = phoneNumber
                user.address = address
                user.genderId = genderId
                user.roleId = roleId
                user.image = image
                let check = await user.save()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update user successfully",
                        messageVI: "Cập nhật người dùng thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Update user failure",
                        messageVI: "Cập nhật người dùng thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUserById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let user = await db.User.findOne({
                where: { id: id }
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    messageEN: "User isn't exist",
                    messageVI: "Người dùng không tồn tại"
                })
            } else {
                let check = await user.destroy();
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete user successfully",
                        messageVI: "Xóa người dùng thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete user failure",
                        messageVI: "Xóa người dùng thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}


//book

let getAllBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let books = await db.Book.findAll({
                raw: true,
                include: [
                    { model: db.Allcode, as: 'categoryData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Author, as: 'authorData' },
                    {
                        model: db.Book_Infor, as: 'bookInforData',
                        include: [
                            { model: db.Shelf, as: 'shelfData', attributes: ['name'] }
                        ]
                    }
                ],
                nest: true
            })
            if (!books) {
                resolve({
                    errCode: 1,
                    messageEN: "No Book",
                    messageVI: "Không có sách nào"
                })
            } else {
                if (books.length > 0) {
                    books = books.map(item => {
                        if (item.image) {
                            item.image = new Buffer(item.image, 'base64').toString('binary')
                        }
                        delete item.password
                        return item
                    })

                }
                resolve({
                    errCode: 0,
                    messageEN: "Get book successfully",
                    messageVI: "Lấy sách thành công",
                    data: books
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let addNewBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, image, categoryId, authorId, quantity, shelfId, roomId, description } = data;
            let checkExist = await db.Book.findOne({
                where: { name: name, categoryId: categoryId }
            })
            if (checkExist) {
                resolve({
                    errCode: 2,
                    messageEN: "This book isn't exist",
                    messageVI: "Quyển sách này đã tồn tại"
                })
            } else {
                let checkRoom = await db.Book_Infor.findOne({
                    where: { roomId: roomId }
                })
                if (checkRoom) {
                    resolve({
                        errCode: 2,
                        messageEN: "Room isn't exist",
                        messageVI: "Phòng chat bị trùng"
                    })
                } else {
                    let checkBook = await db.Book.create({
                        name: name,
                        image: image,
                        authorId: authorId,
                        categoryId: categoryId,
                        quantity: quantity,
                        borrowed: 0
                    })
                    let checkInfor = await db.Book_Infor.create({
                        bookId: checkBook && checkBook.id,
                        shelfId: +shelfId,
                        roomId: roomId,
                        description: description,
                    })

                    if (checkBook && checkInfor) {
                        resolve({
                            errCode: 0,
                            messageEN: "Create New book successfully",
                            messageVI: "Tạo sách mới thành công"
                        })
                    } else {
                        if (checkBook && !checkInfor) {
                            resolve({
                                errCode: 1,
                                messageEN: "Book created successfully but book information creation failed",
                                messageVI: "Đã tạo sách thành công nhưng tạo thông tin sách thất bại"
                            })
                        }
                        if (!checkBook && checkInfor) {
                            resolve({
                                errCode: 1,
                                messageEN: "Book information created successfully but book creation failed",
                                messageVI: "Đã tạo thông tin sách thành công nhưng tạo sách thất bại"
                            })
                        }
                        resolve({
                            errCode: 1,
                            messageEN: "Create New book failure",
                            messageVI: "Tạo sách mới thất bại"
                        })
                    }

                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let getBookByCategory = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { category } = data
            let books = await db.Book.findAll({
                where: { categoryId: category }
            })
            if (!books || books.length === 0) {
                resolve({
                    errCode: 1,
                    messageEN: "No Book",
                    messageVI: "Không có sách nào"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get Book successfully",
                    messageVI: "Lấy sách thành công",
                    data: users
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateBookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, image, authorId, categoryId, quantity, shelfId, roomId, description, id } = data;
            let book = await db.Book.findOne({
                where: { id: id }
            })
            let bookInfor = await db.Book_Infor.findOne({ where: { id: book && book.id } })
            if (book && book.name === name && book.categoryId === categoryId && bookInfor.roomId === roomId) {

                book.name = name
                book.image = image
                book.authorId = authorId
                book.categoryId = categoryId
                book.quantity = +quantity
                bookInfor.shelfId = +shelfId
                bookInfor.roomId = roomId
                bookInfor.description = description
                let checkBook = await book.save()
                let checkInfor = await bookInfor.save()
                if (checkBook && checkInfor) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update book successfully",
                        messageVI: "Cập nhật sách thành công"
                    })
                } else if (checkBook && !checkInfor) {
                    resolve({
                        errCode: 1,
                        messageEN: "Book update successful but book extra information update failed",
                        messageVI: "Cập nhật sách thành công nhưng thông tin chi tiết sách cập nhật thất bại"
                    })
                } else if (!checkBook && checkInfor) {
                    resolve({
                        errCode: 1,
                        messageEN: "Update book details successfully but book information has not been saved",
                        messageVI: "Cập nhật thông tin chi tiết về sách thành công nhưng thông tin về sách chưa được lưu"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Update book failure",
                        messageVI: "Cập nhật sách thất bại"
                    })
                }

            } else if (book && book.name === name && book.categoryId === categoryId && bookInfor.roomId !== roomId) {
                let checkRoomIdExist = await db.Book_Infor.findOne({ where: { roomId: roomId } })
                if (checkRoomIdExist) {
                    resolve({
                        errCode: 1,
                        messageEN: "Duplicate chat room name, please re-enter",
                        messageVI: "Bị trùng tên phòng chat, vui lòng nhập lại",
                    })
                } else {
                    book.name = name
                    book.image = image
                    book.authorId = authorId
                    book.categoryId = categoryId
                    book.quantity = +quantity
                    bookInfor.shelfId = +shelfId
                    bookInfor.roomId = roomId
                    bookInfor.description = description
                    let checkBook = await book.save()
                    let checkInfor = await bookInfor.save()
                    if (checkBook && checkInfor) {
                        resolve({
                            errCode: 0,
                            messageEN: "Update book successfully",
                            messageVI: "Cập nhật sách thành công"
                        })
                    } else if (checkBook && !checkInfor) {
                        resolve({
                            errCode: 1,
                            messageEN: "Book update successful but book extra information update failed",
                            messageVI: "Cập nhật sách thành công nhưng thông tin chi tiết sách cập nhật thất bại"
                        })
                    } else if (!checkBook && checkInfor) {
                        resolve({
                            errCode: 1,
                            messageEN: "Update book details successfully but book information has not been saved",
                            messageVI: "Cập nhật thông tin chi tiết về sách thành công nhưng thông tin về sách chưa được lưu"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Update book failure",
                            messageVI: "Cập nhật sách thất bại"
                        })
                    }
                }
            } else if (bookInfor && bookInfor.roomId === roomId) {
                let check = await db.Book.findOne({ where: { name: name, categoryId: categoryId } })
                if (check) {
                    resolve({
                        errCode: 1,
                        messageEN: "There can't be two books with the same title in one subject",
                        messageVI: "Trong một đề tài không thể có hai quyển sách cùng tên"
                    })
                } else {
                    book.name = name
                    book.image = image
                    book.authorId = authorId
                    book.categoryId = categoryId
                    book.quantity = +quantity
                    bookInfor.shelfId = +shelfId
                    bookInfor.roomId = roomId
                    bookInfor.description = description
                    let checkBook = await book.save()
                    let checkInfor = await bookInfor.save()
                    if (checkBook && checkInfor) {
                        resolve({
                            errCode: 0,
                            messageEN: "Update book successfully",
                            messageVI: "Cập nhật sách thành công"
                        })
                    } else if (checkBook && !checkInfor) {
                        resolve({
                            errCode: 1,
                            messageEN: "Book update successful but book extra information update failed",
                            messageVI: "Cập nhật sách thành công nhưng thông tin chi tiết sách cập nhật thất bại"
                        })
                    } else if (!checkBook && checkInfor) {
                        resolve({
                            errCode: 1,
                            messageEN: "Update book details successfully but book information has not been saved",
                            messageVI: "Cập nhật thông tin chi tiết về sách thành công nhưng thông tin về sách chưa được lưu"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Update book failure",
                            messageVI: "Cập nhật sách thất bại"
                        })
                    }
                }
            } else {
                let check = await db.Book.findOne({ where: { name: name, categoryId: categoryId } })
                if (check) {
                    resolve({
                        errCode: 1,
                        messageEN: "There can't be two books with the same title in one subject",
                        messageVI: "Trong một đề tài không thể có hai quyển sách cùng tên"
                    })
                } else {
                    let checkRoomIdExist = await db.Book_Infor.findOne({ where: { roomId: roomId } })
                    if (checkRoomIdExist) {
                        resolve({
                            errCode: 1,
                            messageEN: "Duplicate chat room name, please re-enter",
                            messageVI: "Bị trùng tên phòng chat, vui lòng nhập lại",
                        })
                    } else {
                        book.name = name
                        book.image = image
                        book.authorId = authorId
                        book.categoryId = categoryId
                        book.quantity = +quantity
                        bookInfor.shelfId = +shelfId
                        bookInfor.roomId = roomId
                        bookInfor.description = description
                        let checkBook = await book.save()
                        let checkInfor = await bookInfor.save()
                        if (checkBook && checkInfor) {
                            resolve({
                                errCode: 0,
                                messageEN: "Update book successfully",
                                messageVI: "Cập nhật sách thành công"
                            })
                        } else if (checkBook && !checkInfor) {
                            resolve({
                                errCode: 1,
                                messageEN: "Book update successful but book extra information update failed",
                                messageVI: "Cập nhật sách thành công nhưng thông tin chi tiết sách cập nhật thất bại"
                            })
                        } else if (!checkBook && checkInfor) {
                            resolve({
                                errCode: 1,
                                messageEN: "Update book details successfully but book information has not been saved",
                                messageVI: "Cập nhật thông tin chi tiết về sách thành công nhưng thông tin về sách chưa được lưu"
                            })
                        } else {
                            resolve({
                                errCode: 1,
                                messageEN: "Update book failure",
                                messageVI: "Cập nhật sách thất bại"
                            })
                        }
                    }
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

let deleteBookById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let book = await db.Book.findOne({
                where: { id: id }
            })
            if (!book) {
                resolve({
                    errCode: 1,
                    messageEN: "Book isn't exist",
                    messageVI: "Sách không tồn tại"
                })
            } else {
                let check = await book.destroy();
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete book successfully",
                        messageVI: "Xóa sách thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete book failure",
                        messageVI: "Xóa sách thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

//author

let addNewAuthor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, image, birthDay, description, genderId } = data
            let check = await db.Author.create({ name, image, birthDay, description, genderId: genderId })
            if (check) {
                resolve({
                    errCode: 0,
                    messageEN: "Create New author successfully",
                    messageVI: "Tạo tác giả mới thành công"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageENmessageEN: "Create New author failure",
                    messageVI: "Tạo tác giả mới thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllAuthor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let authors = await db.Author.findAll({
                include: [
                    { model: db.Allcode, as: 'genderAuthorData', attributes: ['valueEn', 'valueVi'] }
                ],
                nest: true
            })
            if (!authors) {
                resolve({
                    errCode: 1,
                    messageEN: "No Author",
                    messageVI: "Không có tác giả nào"
                })
            } else {
                authors = authors.map(item => {
                    if (item.image) {
                        item.image = new Buffer(item.image, 'base64').toString('binary')
                    }
                    return item
                })
                resolve({
                    errCode: 0,
                    messageEN: "Get author successfully",
                    messageVI: "Lấy tác giả thành công",
                    data: authors
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateAuthorById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, image, birthDay, description, id, genderId } = data
            let author = await db.Author.findOne({
                where: { id: id }
            })
            if (!author) {
                resolve({
                    errCode: 1,
                    messageEN: "Author isn't exist",
                    messageVI: "Tác giả không tồn tại"
                })
            } else {
                author.name = name
                author.image = image
                author.birthDay = birthDay
                author.genderId = genderId
                author.description = description
                let check = await author.save()
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update author successfully",
                        messageVI: "Cập nhật tác giả thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Update author failure",
                        messageVI: "Cập nhật tác giả thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteAuthorById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let author = await db.Author.findOne({
                where: { id: id }
            })
            if (!author) {
                resolve({
                    errCode: 1,
                    messageEN: "Author isn't exist",
                    messageVI: "Tác giả không tồn tại"
                })
            } else {
                let check = await author.destroy();
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete author successfully",
                        messageVI: "Xóa tác giả thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete author failure",
                        messageVI: "Xóa tác giả thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

//shelf

let addNewShelf = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, location, description } = data
            let checkExist = await db.Shelf.findOne({ where: { name: name } })
            if (checkExist) {
                resolve({
                    errCode: 1,
                    messageEN: "Shelf's name isn't exist",
                    messageVI: "Tên kệ sách này đã tồn tại"
                })
            } else {

                let check = await db.Shelf.create({
                    name: name,
                    location: location,
                    description: description
                })
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Create New shelf successfully",
                        messageVI: "Tạo kệ sách mới thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageENmessageEN: "Create New shelf failure",
                        messageVI: "Tạo kệ sách mới thất bại"
                    })
                }
            }

        } catch (error) {
            reject(error);
        }
    })
}

let getAllShelf = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let shelfs = await db.Shelf.findAll()
            if (!shelfs) {
                resolve({
                    errCode: 1,
                    messageEN: "No Shelf",
                    messageVI: "Không có kệ sách nào"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get shelf successfully",
                    messageVI: "Lấy kệ sách thành công",
                    data: shelfs
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateShelfById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { name, location, description, id } = data
            let shelf = await db.Shelf.findOne({
                where: { id: id }
            })
            if (!shelf) {
                resolve({
                    errCode: 1,
                    messageEN: "Shelf isn't exist",
                    messageVI: "Kệ sách không tồn tại"
                })
            } else {
                if (shelf.name === name) {
                    resolve({
                        errCode: 0,
                        messageEN: "Update shelf successfully",
                        messageVI: "Cập nhật kệ sách thành công"
                    })
                } else {
                    let checkExist = await db.Shelf.findOne({ where: { name: name } })
                    if (checkExist) {
                        resolve({
                            errCode: 1,
                            messageEN: "Shelf's name isn't exist",
                            messageVI: "Tên kệ sách này đã tồn tại"
                        })
                    } else {
                        shelf.name = name
                        shelf.location = location
                        shelf.description = description
                        let check = await shelf.save()
                        if (check) {
                            resolve({
                                errCode: 0,
                                messageEN: "Update shelf successfully",
                                messageVI: "Cập nhật kệ sách thành công"
                            })
                        } else {
                            resolve({
                                errCode: 1,
                                messageEN: "Update shelf failure",
                                messageVI: "Cập nhật kệ sách thất bại"
                            })
                        }

                    }

                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteShelfById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { id } = data
            let shelf = await db.Shelf.findOne({
                where: { id: id }
            })
            if (!shelf) {
                resolve({
                    errCode: 1,
                    messageEN: "Shelf isn't exist",
                    messageVI: "Kệ sách không tồn tại"
                })
            } else {
                let check = await shelf.destroy();
                if (check) {
                    resolve({
                        errCode: 0,
                        messageEN: "Delete shelf successfully",
                        messageVI: "Xóa kệ sách thành công"
                    })
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete shelf failure",
                        messageVI: "Xóa kệ sách thất bại"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let getListCartToManage = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let carts = await db.Cart.findAll({
                where: {
                    [Op.or]: [{ statusId: 'W' }, { statusId: 'B' }]
                },
                include: [
                    { model: db.User, as: "userCartData", include: [{ model: db.Allcode, as: "genderUserData", attributes: ['valueEn', 'valueVi'] }] },
                    { model: db.Book, as: "bookCartData", include: [{ model: db.Author, as: "authorData", attributes: ['name'] }] },

                ],
                order: [['createdAt', 'DESC']],
                nest: true

            })
            if (carts) {
                if (carts.length > 0) {
                    carts = carts.map(item => {
                        if (item.userCartData && item.userCartData.image) {
                            item.userCartData.image = new Buffer(item.userCartData.image, 'base64').toString('binary')
                        }
                        return item
                    })
                }
                // console.log(carts)
                resolve({
                    errCode: 0,
                    messageEN: "Get list cart waitting successfully",
                    messageVI: "Lấy danh sách giỏ hàng đang chờ thành công",
                    data: carts
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Get list cart waitting failure",
                    messageVI: "Lấy danh sách giỏ hàng đang chờ thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createNewTransaction = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { firstName, lastName, address, phoneNumber, returnDate, bookId, time } = data
            let check = await db.sequelize.transaction((t) => {
                return db.User.create({
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    phoneNumber: phoneNumber,
                }, { transaction: t })
                    .then((a) => {
                        return db.Cart.create({
                            userId: a.id,
                            returnDate: returnDate,
                            bookId: bookId,
                            time: time,
                            statusId: 'B'
                        }, { transaction: t });
                    });
            })
            if (check) {
                resolve({
                    errCode: 0,
                    messageEN: "Create new transaction successfully",
                    messageVI: "Tạo giao dịch mới thành công"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Create new transaction failure",
                    messageVI: "Tạo giao dịch mới thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateOneTransaction = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { cartId, userId, firstName, lastName, address, phoneNumber, returnDate } = data
            let check = await db.sequelize.transaction((t) => {
                return db.User.update({
                    firstName: firstName,
                    lastName: lastName,
                    address: address,
                    phoneNumber: phoneNumber
                }, { where: { id: userId }, transaction: t })
                    .then(() => {
                        return db.Cart.update({
                            returnDate: returnDate
                        }, { where: { id: cartId }, transaction: t });
                    });
            })
            if (check) {
                resolve({
                    errCode: 0,
                    messageEN: "Update one transaction successfully",
                    messageVI: "Cập nhật giao dịch thành công"
                })
            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Update one transaction failure",
                    messageVI: "Cập nhật giao dịch thất bại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let confirmOneTransactionSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { cartId, userId, bookId, borrowDate, returnDate } = data
            let checkExist = await db.Cart.findOne({ where: { userId: userId, id: cartId } })
            let book = await db.Book.findOne({ where: { id: bookId } })
            if (checkExist) {
                let checkDelete = await checkExist.destroy()
                if (checkDelete) {
                    let checkCreate = await db.History.create({
                        userId: userId,
                        bookId: bookId,
                        borrowDate: borrowDate,
                        returnDate: returnDate
                    })
                    book.quantity = book.quantity + 1
                    await book.save()
                    if (checkCreate) {
                        resolve({
                            errCode: 0,
                            messageEN: "Confirm transaction successfully",
                            messageVI: "Xác nhận giao dịch thành công"
                        })
                    } else {
                        resolve({
                            errCode: 1,
                            messageEN: "Confirm transaction failure",
                            messageVI: "Xác nhận giao dịch thất bại"
                        })
                    }
                } else {
                    resolve({
                        errCode: 1,
                        messageEN: "Delete cart failure",
                        messageVI: "Xóa giỏ hàng thất bại"
                    })
                }

            } else {
                resolve({
                    errCode: 1,
                    messageEN: "Transaction isn't exist",
                    messageVI: "Giao dịch này không tồn tại"
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}


let updateCartBorrowSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { userId, cartId, time, bookId } = data
            let checkCart = await db.Cart.findOne({ where: { id: cartId, userId: userId } })
            let bookSelected = await db.Book.findOne({ where: { id: bookId } })
            if (!checkCart && !bookSelected) {
                resolve({
                    errCode: 1,
                    messageEN: "Cart not found",
                    messageVI: "Giỏ hàng không tìm thấy"
                })
            } else {
                console.log('truoc khi xac nhan', bookSelected.quantity)
                checkCart.statusId = 'B'
                checkCart.time = time
                bookSelected.borrowed = +bookSelected.borrowed + 1
                bookSelected.quantity = +bookSelected.quantity - 1
                let check = await checkCart.save()
                let checkUpdateBook = await bookSelected.save()
                if (!check && !checkUpdateBook) {
                    resolve({
                        errCode: 1,
                        messageEN: "Send request failure",
                        messageVI: "Yêu cầu gửi đi thất bại"
                    })
                } else if (!check && checkUpdateBook) {
                    resolve({
                        errCode: 1,
                        messageEN: "Confirm that the request to borrow a book is successful but the book information update failed",
                        messageVI: "Xác nhận yêu cầu mượn sách thành công nhưng cập nhật thông tin sách thất bại"
                    })
                } else if (check && !checkUpdateBook) {
                    resolve({
                        errCode: 1,
                        messageEN: "Confirm that the request to borrow a book failed but update the book information successfully",
                        messageVI: "Xác nhận yêu cầu mượn sách thất bại nhưng cập nhật thông tin sách thành công"
                    })
                } else {
                    resolve({
                        errCode: 0,
                        messageEN: "Send request successfully",
                        messageVI: "Yêu cầu gửi đi thành công"
                    })
                }

            }
        } catch (error) {
            reject(error);
        }
    })
}

let getHistoryByTime = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { startDate, endDate } = data
            let listHistory = await db.History.findAll({
                where: { createdAt: { [Op.between]: [startDate, endDate] } },
                include: [
                    { model: db.User, as: 'userData', attributes: ['firstName', 'lastName', 'phoneNumber'] },
                    {
                        model: db.Book, as: 'bookHistoryData',
                        include: [{ model: db.Author, as: 'authorData' }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })
            if (!listHistory) {
                resolve({
                    errCode: 1,
                    messageEN: "No transactions for this period of time",
                    messageVI: "Không thấy giao dịch nào trong khoảng thời gian này"
                })
            } else {
                resolve({
                    errCode: 0,
                    messageEN: "Get a list of successful transactions during this time period",
                    messageVI: "Lấy danh sách lịch sự giao dịch trong khoảng thời gian này thành công",
                    data: listHistory
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {
    addNewUser,
    getHistoryByTime,
    confirmOneTransactionSuccess,
    updateOneTransaction,
    getUserByRole,
    createNewTransaction,
    getListCartToManage,
    updateCartBorrowSuccess,
    updateUserById,
    deleteUserById,
    addNewBook,
    getBookByCategory,
    updateBookById,
    deleteBookById,
    addNewAuthor,
    getAllAuthor,
    updateAuthorById,
    deleteAuthorById,
    addNewShelf,
    getAllShelf,
    updateShelfById,
    deleteShelfById,
    getAllUser,
    getAllHistory,
    getAllBook,
}
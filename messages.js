module.exports.errors = {
    "EMPTY_FIELDS": {
        content: "Some field left empty",
        code: 400
    },
    "LOGIN_FAILED": {
        content: "Login failed",
        code: 400
    },
    "REGISTER_FAILED": {
        content: "Register failed",
        code: 400
    },
    "UNKNOW_ERROR": {
        content: "Error occured but i don't know what it is",
        code: 500
    },
    "USER_NOT_FOUND": {
        content: "Invalid User",
        code: 400
    },
    "USER_EXIST": {
        content: "User has already been registered",
        code: 400
    },
    "OLD_PASSWORD_NOT_MATCH": {
        content: "Wrong old password",
        code: 403
    },
    "WRONG_CARD_NUMBER": {
        content: "Wrong card number",
        code: 400
    },
    "NOT_AUTHENTICATED": {
        content: "You are not logged in",
        code: 403
    },
    "INVALID_JWT": {
        content: "Invalid JWT",
        code: 403
    },
    "NOT_ADMIN": {
        content: "You need to be an admin to access this endpoint",
        code: 403
    },
    "NEED_MORE_CREDIT_OR_AMOUNT_INVALID": {
        content: "Not enough credit or invalid amount",
        code: 400
    }
}

module.exports.messages = {
    "LOGIN_SUCCESS": {
        content: "Login success",
        code: 200
    },
    "REGISTER_SUCCESS": {
        content: "Register success",
        code: 200
    },
    "LOGOUT_SUCESS": {
        content: "Logged out",
        code: 200
    },
    "SUCCESS": {
        content: "Success",
        code: 200
    }
}
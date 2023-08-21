const statusPhrases = {
  descriptions: {
    200: "Success",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    500: "Internal Server Error",
  },
  message: {
    AuthService: {
      login: {
        200: "The user successfully logged in with valid credentials.",
        401: "The provided email or password is incorrect",
        404: "The provided email is not associated with any account",
      },
      register: {
        409: `Email already registered`,
        201: "Successful registration",
      },
    },
    UserService: {
      index: {
        200: "The list of users is successfully fetched for display or processing",
      },
      showByID: {
        200: `The user data is successfully fetched for display or processing`,
      },
      isDuplicate: {
        409: `Email already exists`,
        200: `Email is available to use`,
      },
      create: {
        409: `User already exists`,
        200: `The user account is successfully created.`,
      },
      update: {
        200: `User has been updated`,
      },
      deleteByID: {
        204: `The user account is successfully deleted`
      }
    },
  },
};

module.exports = statusPhrases;

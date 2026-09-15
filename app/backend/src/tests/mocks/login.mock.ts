export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidXNlckB1c2VyLmNvbSIsInBhc3N3b3JkIjoic2VjcmV0X3VzZXIifSwiaWF0IjoxNzg5NTA1MjQ5fQ.kzwmuLY274V_21egvYX-iL0sDfVO2bx9zcktIZlF0hg";

export const validUser = {
   id: 2,
   username: 'User',
   role: 'user',
   email: 'user@user.com',
   password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO'
}

export const validLogin = {
   email: "user@user.com",
   password: "secret_user"
 }

 export const invalidEmail = {
   email: "email@errado.com",
   password: "secret_user"
 }

 export const invalidPwd = {
   email: "user@user.com",
   password: "123456"
 }

 export const withoutEmail = {
   password: "secret_user"
 }

 export const withoutPwd = {
   email: "user@user.com",
 }
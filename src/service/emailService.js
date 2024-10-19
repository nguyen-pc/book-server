require("dotenv").config();

const nodemailer = require("nodemailer");

let sendSimpleEmail = async (email, bookName, borrowDay) => {
  console.log("email", email, bookName, borrowDay);
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Thanh Nguyen 👻" <nguyenthcs430@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Thông tin mượn sách", // Subject line
    html: getBodyHTMLEmail(bookName, borrowDay),
  });
};

let getBodyHTMLEmail = (bookName, borrowDay) => {
  let result = "";

  result = `
    <h3> Xin chào !</h3>
    <p>Bạn nhận được email này vì đã mượn sách thành công</p>
    <p>Thông tin mượn sách: </p>
    <p>Tên sách:${bookName} </p>
    <p>Thời hạn trả 2 tuần: ${borrowDay}</p>
    <div>Xin chân thành cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</div>
`;
  return result;
};

// let getBodyHTMLEmailRemedy = (dataSend) => {
//   let result = "";
//   if (dataSend.language === "vi") {
//     result = `
//     <h3> Xin chào ${dataSend.patientName}!</h3>
//     <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Thanh Nguyên Booking Care</p>
//     <p>Thông tin đơn thuốc/hóa đơn gửi trong file đính kèm : </p>

//     <div>Xin chân thành cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</div>
// `;
//     return result;
//   }
//   if (dataSend.language === "en") {
//     result = `
//       <h3>Dear ${dataSend.patientName}!</h3>
//       <p>You received this email because you booked a medical appointment on Thanh Nguyen Booking Care</p>
//       <p>
//       Prescription information/invoice sent in the attached file: </p>

//       <div>Thank you very much for using our service!</div>
//     `;
//   }
//   return result;
// };

// let sendAttachment = async (dataSend) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       // create reusable transporter object using the default SMTP transport
//       let transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//           user: process.env.EMAIL_APP, // generated ethereal user
//           pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
//         },
//       });

//       // send mail with defined transport object
//       let info = await transporter.sendMail({
//         from: '"Thanh Nguyen 👻" <nguyenthcs430@gmail.com>', // sender address
//         to: dataSend.email, // list of receivers
//         subject: "Kết quả đặt lịch khám bệnh", // Subject line
//         html: getBodyHTMLEmailRemedy(dataSend),
//         attachments: [
//           {
//             filename: `remedy-${
//               dataSend.patientName
//             }-${new Date().getTime()}.png`,
//             content: dataSend.imgBase64.split("base64,")[1],
//             encoding: "base64",
//           },
//         ],
//       });

//       resolve(true);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  // sendAttachment: sendAttachment,
};

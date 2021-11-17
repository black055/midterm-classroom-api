import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
        user: 'classroomreactapp@gmail.com',
        pass: 'Thisisapassword123'
    }
 });

export function sendInviteStudentEmail(receiver, course, sender) {
    return new Promise((resolve,reject)=>{
        const mailOptions = {
            from: process.env.MAILER_USERNAME,
            to: receiver,
            subject: `Mời tham gia lớp học ${course.name}`,
            html: `
            <p>Chào bạn,</p></br>
    
            <p>Bạn nhận được lời mời tham gia lớp học <strong>[${course.briefName}] ${course.name}</strong> từ <strong>${sender.firstname} ${sender.lastname}</strong>.</p>
            
            <p>Nếu đồng ý vui lòng truy cập vào link bên dưới và đăng nhập để xác nhận tham gia:</p>
            <p>Http://Link-invite-student.com</p></br>
            
            <p>Xin cảm ơn.</p>
             `
        };
    
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

export function sendInviteTeacherEmail(receiver, course, sender) {
    return new Promise((resolve,reject)=>{
        const mailOptions = {
            from: process.env.MAILER_USERNAME,
            to: receiver,
            subject: `Mời tham gia giảng dạy lớp học ${course.name}`,
            html: `
            <p>Chào bạn,</p></br>
    
            <p>Bạn nhận được lời mời dạy lớp học <strong>[${course.briefName}] ${course.name}</strong> từ <strong>${sender.firstname} ${sender.lastname}</strong>.</p>
            
            <p>Nếu đồng ý vui lòng truy cập vào link bên dưới và đăng nhập để xác nhận tham gia:</p>
            <p>Http://Link-invite-student.com</p></br>
    
            <p>Xin cảm ơn.</p>
             `
        };
    
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}
const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.name = user.name.split(' ')[0] || user.name;
        this.url = url;
        this.from = `Masar Platform <${process.env.EMAIL_FROM}>`;
    }

    getTransport() {
        if (process.env.NODE_ENV === 'production') {
            return nodemailer.createTransport({
                host: process.env.GMAIL_HOST,
                port: process.env.GMAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.GMAIL_USERNAME,
                    pass: process.env.GMAIL_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USERNAME,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });
    }

    //  Send Code
    async send(subject, htmlContent) {
        const emailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: htmlContent,
        };

        try {
            await this.getTransport().sendMail(emailOptions);
        } catch (err) {
            console.error(`❌ Email failed: ${err.message}`);
            throw err;
        }
    }

    //  1. OTP Verification
    async sendOTP(otpCode) {
        const html = `
      <div style="max-width:500px;margin:auto;padding:40px;font-family:sans-serif;
                  border:1px solid #eee;border-radius:15px;background:#fff;text-align:center;">
        <div style="font-size:40px;margin-bottom:20px;">🔐</div>
        <h2 style="color:#2563EB;margin-bottom:10px;">Masar — رمز التحقق</h2>
        <p style="color:#666;">استخدم الكود التالي لتفعيل حسابك على منصة مسار:</p>
        <div style="background:#EFF6FF;padding:20px;border-radius:10px;margin:25px 0;">
          <h1 style="color:#2563EB;letter-spacing:10px;font-size:36px;margin:0;">${otpCode}</h1>
        </div>
        <p style="color:#999;font-size:14px;">هذا الكود صالح لمدة <strong>10 دقائق</strong> فقط.</p>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('رمز التحقق الخاص بك — Masar Platform 🔐', html);
    }

    //  2. Welcome
    async sendWelcome() {
        const html = `
      <div style="max-width:600px;margin:auto;border-top:6px solid #2563EB;
                  padding:40px 20px;font-family:sans-serif;background:#fdfdfd;
                  border-radius:8px;text-align:center;">
        <h1 style="color:#2563EB;">أهلاً بك في Masar 🚀</h1>
        <p style="font-size:16px;color:#555;line-height:1.7;">
          مرحباً ${this.name}، يسعدنا انضمامك إلى منصة مسار —
          المنصة العربية المتخصصة في ربط أصحاب المشاريع بأفضل المستقلين.
        </p>
        <div style="margin:30px 0;">
          <a href="${this.url}"
             style="background:#2563EB;color:white;padding:12px 30px;
                    text-decoration:none;border-radius:50px;font-weight:bold;font-size:16px;">
            ابدأ الآن
          </a>
        </div>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('أهلاً بك في Masar 🚀', html);
    }

    //  3. Password Reset
    async sendPasswordReset() {
        const html = `
      <div style="max-width:500px;margin:auto;padding:40px;font-family:sans-serif;
                  text-align:center;background:#fff;border-radius:15px;border:1px solid #eee;">
        <div style="font-size:40px;margin-bottom:20px;">🔑</div>
        <h2 style="color:#2563EB;">إعادة تعيين كلمة المرور</h2>
        <p style="color:#666;line-height:1.7;">
          طلبت إعادة تعيين كلمة المرور الخاصة بك على Masar.
          اضغط على الزر أدناه لإتمام العملية.
        </p>
        <div style="margin:30px 0;">
          <a href="${this.url}"
             style="background:#2563EB;color:white;padding:12px 30px;
                    text-decoration:none;border-radius:50px;font-weight:bold;">
            إعادة تعيين كلمة المرور
          </a>
        </div>
        <p style="color:#999;font-size:13px;">هذا الرابط صالح لمدة <strong>10 دقائق</strong> فقط.</p>
        <p style="color:#bbb;font-size:12px;">إذا لم تطلب ذلك، تجاهل هذا البريد وحسابك بأمان.</p>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('إعادة تعيين كلمة المرور — Masar 🔑', html);
    }

    // 4. Proposal Accepted
    async sendProposalAccepted(projectTitle) {
        const html = `
      <div style="max-width:500px;margin:auto;padding:40px;font-family:sans-serif;
                  text-align:center;background:#fff;border-radius:15px;border:1px solid #eee;">
        <div style="font-size:40px;margin-bottom:20px;">🎉</div>
        <h2 style="color:#16A34A;">تهانينا! تم قبول عرضك</h2>
        <p style="color:#555;line-height:1.7;">
          مرحباً ${this.name}، تم قبول عرضك على مشروع
          <strong>${projectTitle}</strong>.
        </p>
        <div style="margin:30px 0;">
          <a href="${this.url}"
             style="background:#16A34A;color:white;padding:12px 30px;
                    text-decoration:none;border-radius:50px;font-weight:bold;">
            عرض العقد
          </a>
        </div>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('تم قبول عرضك على Masar 🎉', html);
    }

    // 5. Payment Released
    async sendPaymentReleased(amount, milestoneTitle) {
        const html = `
      <div style="max-width:500px;margin:auto;padding:40px;font-family:sans-serif;
                  text-align:center;background:#fff;border-radius:15px;border:1px solid #eee;">
        <div style="font-size:40px;margin-bottom:20px;">💰</div>
        <h2 style="color:#2563EB;">تم إطلاق الدفعة!</h2>
        <p style="color:#555;line-height:1.7;">
          مرحباً ${this.name}، تم إطلاق دفعة بقيمة
          <strong>${amount} EGP</strong>
          للمرحلة: <strong>${milestoneTitle}</strong>.
        </p>
        <div style="margin:30px 0;">
          <a href="${this.url}"
             style="background:#2563EB;color:white;padding:12px 30px;
                    text-decoration:none;border-radius:50px;font-weight:bold;">
            عرض المحفظة
          </a>
        </div>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('تم إطلاق دفعتك على Masar 💰', html);
    }
    // 6. Milestone Funded (Client paid, Escrow ready)
    async sendMilestoneFunded(amount, milestoneTitle) {
        const html = `
      <div style="max-width:500px;margin:auto;padding:40px;font-family:sans-serif;
                  text-align:center;background:#fff;border-radius:15px;border:1px solid #eee;">
        <div style="font-size:40px;margin-bottom:20px;">🚀</div>
        <h2 style="color:#059669;">تم إيداع الدفعة بنجاح!</h2>
        <p style="color:#555;line-height:1.7;">
          مرحباً ${this.name}، العميل قام بإيداع مبلغ
          <strong>${amount} EGP</strong>
          لتمويل المرحلة: <strong>${milestoneTitle}</strong>.
        </p>
        <p style="color:#666;font-size:14px;background:#ECFDF5;padding:15px;border-radius:8px;">
          الفلوس الآن محفوظة بأمان في منصة مسار. يمكنك البدء في العمل فوراً!
        </p>
        <div style="margin:30px 0;">
          <a href="${this.url}"
             style="background:#059669;color:white;padding:12px 30px;
                    text-decoration:none;border-radius:50px;font-weight:bold;">
            عرض تفاصيل المشروع
          </a>
        </div>
        <hr style="border:0;border-top:1px solid #eee;margin:30px 0;">
        <p style="font-size:12px;color:#aaa;">Masar — منصة العمل الحر للمحترفين العرب</p>
      </div>`;
        await this.send('تم تمويل المرحلة الخاصة بك — ابدأ العمل! 🚀', html);
    }
};

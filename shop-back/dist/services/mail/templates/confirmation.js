"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetConfirmation = exports.updateConfirmation = exports.confirmation = void 0;
const confirmation = (link) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Thank you for signing up, Please verify your email to complete your registration</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.VALIDATIONURL}#/verify/verify/${link}'>Verify Now</a>
</div>`;
};
exports.confirmation = confirmation;
const updateConfirmation = (link) => {
    return `<div style="text-align: center;">
    <h1>Verify Your Email</h1>
    <p>Please verify your email to complete your update</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.VALIDATIONURL}#/verify/verify/${link}'>Verify Now</a>
</div>`;
};
exports.updateConfirmation = updateConfirmation;
const resetConfirmation = (link) => {
    return `<div style="text-align: center;">
    <h1>Reset Your Password</h1>
    <p>Click to reset your password</p>
    <a style="text-align: center;padding: 7px;background-color: black;color: white;border-radius: 4px; text-decoration: none;" href='${process.env.VALIDATIONURL}#/verify/reset/${link}'>Reset</a>
</div>`;
};
exports.resetConfirmation = resetConfirmation;
//# sourceMappingURL=confirmation.js.map
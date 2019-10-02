const sgMail       = require('@sendgrid/mail')
const { sendGrid } = require('../etc/config')

sgMail.setApiKey(sendGrid.apiKey)

module.exports = sgMail

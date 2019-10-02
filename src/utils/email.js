'use strict'

const VALID_EMAIL_REG_EXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

exports.check = email => VALID_EMAIL_REG_EXP.test(email)

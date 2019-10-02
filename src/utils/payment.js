'use strict'

const Bill          = require('../models/bill')
const { isNumeric } = require('./number')

const { ACCOUNT, CREDIT_CARD } = Bill.PAYMENT_METHODS

const SERVICE_TYPES = {
  PREPAID : 'Prepaid',
  POSTPAID: 'Postpaid'
}

const utils = {
  parseBillInquiry: (data, paymentType) => {
    if (paymentType === SERVICE_TYPES.PREPAID && data) {
      return data.Billings || {}
    }

    if (paymentType === SERVICE_TYPES.POSTPAID && data && data.Bills) {
      return data.Bills[0] || {}
    }

    return data || {}
  },

  getAccessChannel: platform => {
    if (platform === 'RestUser') {
      return 'INTERNET'
    }
    if (platform === 'IOSUser' || platform === 'AndroidUser') {
      return 'PDA'
    }

    throw new Error('User platform not supported')
  },

  getExternalType: platform => {
    if (platform === 'RestUser') {
      return 'WEB'
    }
    if (platform === 'IOSUser') {
      return 'APPSIOS'
    }
    if (platform === 'AndroidUser') {
      return 'APPSANDROID'
    }

    throw new Error('User platform not supported')
  },

  getBillingNumber: (service, billingNumber) => {
    if (service.paymentType === 'Prepaid') {
      return service.billingNoRequired ? billingNumber : ''
    }
    if (service.paymentType === 'Postpaid') {
      return billingNumber
    }

    return ''
  },

  normalizeBillingNumber: billingNumber => String(billingNumber).replace(/[^0-9]/g, ''),

  normalizeDueAmount: dueAmount => isNumeric(dueAmount) && Number(Number(dueAmount).toFixed(3)),

  getName: lang => lang === 'ar' ? 'arabicName' : 'englishName',

  getDescription: lang => lang === 'ar' ? 'arabicDescription' : 'englishDescription',

  /**
   * Parse User PaymentMethod field for creating the PaymentSource object for bill payments operation
   *
   * @param {Users} user
   * @return {Object}
   */
  getPaymentDataForQuickPay: user => {
    switch (user.PaymentMethod) {
      case ACCOUNT:
        return {
          paymentMethod: ACCOUNT,
          paymentSource: { Account: user.QuickPayAccount }
        }
      case CREDIT_CARD: {
        return {
          paymentMethod: CREDIT_CARD,
          paymentSource: { CIF: user.CustomerId, CardTrailer: user.QuickPayAccount }
        }
      }
      default:
        return {}
    }
  },

  /**
   * Prepare and return the PaymentMethod and PaymentSource for bill payment operation
   *
   * @param {Boolean} [quickPay]
   * @param {String} [accountNumber]
   * @param {String} [cardNumber]
   * @param {Object} user
   * @returns {Object}
   */
  getPaymentData: (quickPay, accountNumber, cardNumber, user) => {
    // If payment occurs using the "quickPay", PaymentData should always be taken from the user profile
    if (quickPay) {
      return utils.getPaymentDataForQuickPay(user)
    }

    if (accountNumber) {
      return {
        paymentMethod: ACCOUNT,
        paymentSource: { Account: accountNumber }
      }
    }

    if (cardNumber) {
      return {
        paymentMethod: CREDIT_CARD,
        paymentSource: { CIF: user.CustomerId, CardTrailer: cardNumber.substr(-4) }
      }
    }

    return {}
  }
}

module.exports = utils

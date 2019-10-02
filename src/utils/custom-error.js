'use strict'

const ERR_KIND = {
  BL : 'BusinessLogic',
  BS : 'BackendlessServer',
  SC : 'ServerCode',
  MUA: 'MuleApi',
  TWI: 'TwilioApi',
  UNK: 'Unknown',
  CM : 'Common'
}

class WithCode extends Error {
  constructor(message, code) {
    super(message)
    this.code = parseInt(code) || 1
  }
}

class BusinessLogicError extends WithCode {
  constructor(message, code) {
    super(message, code)
    this.kind = ERR_KIND.BL
  }
}

class MuleApiError extends WithCode {
  constructor(message, code) {
    super(message, code)
    this.kind = ERR_KIND.MUA
  }
}

class UnknownError extends WithCode {
  constructor(message, code) {
    super(message, code)
    this.kind = ERR_KIND.UNK
  }
}

class TwilioApiError extends WithCode {
  constructor(message, code, status) {
    super(message, code)
    this.status = status
    this.kind   = ERR_KIND.TWI
  }
}

module.exports = {
  WithCode,
  TwilioApiError,
  MuleApiError,
  UnknownError,
  BusinessLogicError,
  ERR_KIND
}
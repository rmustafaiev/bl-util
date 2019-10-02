'use strict'

const loginRegKeys = {
  verifyCardOrID: cif => `loginReg:verifyCardOrId:${ cif }`,
  session       : cif => `loginReg:session:${ cif }`
}

const sentEmailKeys = {
  transfer: timestamp => `emails:transferObjIds:${ timestamp }`
}

const transferKeys = {
  transfer: (cif, transferId) => `transfer:${ cif }:id:${ transferId }`
}

const onboardingKeys = {
  otp: (mobileNumber, timestamp) => `onboarding:otp:${ mobileNumber }:${ timestamp }`
}

const triggerBillUpdate = customerId => `bills:trigger:update:${ customerId }`

const beneficiaryKeys = {
  otp: cif => `beneficiary:otp:${ cif }`
}

module.exports = {
  loginRegKeys,
  sentEmailKeys,
  transferKeys,
  onboardingKeys,
  triggerBillUpdate,
  beneficiaryKeys
}

const { pick } = require('../utils/object')

const dump = {
  dumpBillWithPayments: bill => {
    let currentPayments = null

    if (bill.payments && bill.payments.length) {
      const PAYMENT_PROPS = [
        'sourceAccount',
        'dueAmount',
        'processDate',
        'billingNumber',
        'settledDate',
        'transactionID',
        'billingNumber'
      ]

      currentPayments = bill.payments.map(payment => pick(payment, PAYMENT_PROPS))
    }

    return {
      billingNumber           : bill.billingNumber,
      billName                : bill.billName,
      dueAmount               : bill.dueAmount,
      lastPaymentAmount       : bill.lastPaymentAmount,
      accountNumber           : bill.accountNumber,
      billerId                : bill.biller && bill.biller.objectId,
      billerServiceId         : bill.billerService && bill.billerService.objectId,
      serviceCategoryId       : bill.serviceCategory && bill.serviceCategory.objectId,
      paymentsCount           : bill.count,
      payments                : currentPayments || [],
      arabicIdentifierLabel   : bill.billerService && bill.billerService.arabicIdentifierLabel,
      englishIdentifierLabel  : bill.billerService && bill.billerService.englishIdentifierLabel,
      dueDate                 : bill.dueDate,
      lastCheckingDate        : bill.lastCheckingDate,
      billerServiceTotalAmount: bill.billerServiceTotalAmount,
      billerTotalAmount       : bill.billerTotalAmount
    }
  },

  dumpBillOnSearch: bill => ({
    billingNumber         : bill.billingNumber,
    billName              : bill.billName,
    dueAmount             : bill.dueAmount,
    accountNumber         : bill.accountNumber,
    billerId              : bill.biller.objectId,
    billerServiceId       : bill.billerService.objectId,
    serviceCategoryId     : bill.serviceCategory && bill.serviceCategory.objectId,
    arabicIdentifierLabel : bill.billerService && bill.billerService.arabicIdentifierLabel,
    englishIdentifierLabel: bill.billerService && bill.billerService.englishIdentifierLabel,
    dueDate               : bill.dueDate,
    lastCheckingDate      : bill.lastCheckingDate,
    objectId              : bill.objectId,
    quickPaySupport       : bill.billerService.checkDueAmount
  }),

  dumpUser: user => ({
    NationalityCode               : user.NationalityCode,
    WebApplicationUserId          : user.WebApplicationUserId,
    Gender                        : user.Gender,
    MobileApplicationUserId       : user.MobileApplicationUserId,
    AccountOpeningDate            : user.AccountOpeningDate,
    CustomerName                  : user.CustomerName,
    CustomerEnglishName           : user.CustomerEnglishName,
    BranchName                    : user.BranchName,
    CountryCode                   : user.CountryCode,
    DateOfBirth                   : user.DateOfBirth,
    Status                        : user.Status,
    GenderDescription             : user.GenderDescription,
    FirstName                     : user.FirstName,
    CustomerId                    : user.CustomerId,
    MiddleName                    : user.MiddleName,
    UniqueIdentificationTypeMap   : user.UniqueIdentificationTypeMap,
    MaritalStatusDescription      : user.MaritalStatusDescription,
    AccountNumber                 : user.AccountNumber,
    AddressLine3                  : user.AddressLine3,
    SegmentDescription            : user.SegmentDescription,
    MaritalStatus                 : user.MaritalStatus,
    AddressLine2                  : user.AddressLine2,
    MobileNumber                  : user.MobileNumber,
    AddressLine1                  : user.AddressLine1,
    SegmentCode                   : user.SegmentCode,
    AddressLine4                  : user.AddressLine4,
    LastName                      : user.LastName,
    BranchCode                    : user.BranchCode,
    UniqueIdentificationType      : user.UniqueIdentificationType,
    card                          : user.card,
    UniqueIdentificationTypeNumber: user.UniqueIdentificationTypeNumber,
    email                         : user.email,
    isVerified                    : user.isVerified,
    password                      : user.password,
    username                      : user.username,
    twilioId                      : user.twilioId,
    driverId                      : user.DriverId
  }),

  dumpUserForUpdate: data => ({
    email                   : data.Email,
    MobileNumber            : data.MobileNumber,
    AddressLine1            : data.AddressLine1,
    AddressLine2            : data.AddressLine2,
    AddressLine3            : data.AddressLine3,
    AddressLine4            : data.AddressLine4,
    FirstName               : data.FirstName,
    MiddleName              : data.MiddleName,
    LastName                : data.LastName,
    CustomerName            : data.CustomerName,
    CustomerEnglishName     : data.CustomerEnglishName,
    NationalityCode         : data.NationalityCode,
    Status                  : data.Status,
    MaritalStatusDescription: data.MaritalStatusDescription,
    MaritalStatus           : data.MaritalStatus,
    SegmentDescription      : data.SegmentDescription,
    SegmentCode             : data.SegmentCode,
    driverId                : data.DriverId
  }),

  dumpUserForUpdateOnCORE: data => ({
    Email       : data.email,
    MobileNumber: data.MobileNumber,
    AddressLine1: data.AddressLine1,
    AddressLine2: data.AddressLine2,
    AddressLine3: data.AddressLine3,
    AddressLine4: data.AddressLine4,
    Country     : data.Country
  }),

  dumpUserToReturnOnUI: (user, removeFields) => {
    removeFields.forEach(field => {
      delete user[field]
    })

    return user
  },

  dumpUnpaidPostpaidBill: bill => ({
    billName : bill.billName,
    dueAmount: bill.dueAmount,
    icon     : bill.biller.icon || null
  }),

  dumpDigitalUserForRegister: digitalUser => ({
    Gender      : digitalUser.gender,
    CustomerName: digitalUser.name,
    DateOfBirth : digitalUser.dateOfBirth,
    FirstName   : digitalUser.name,
    MobileNumber: digitalUser.phone,
    email       : digitalUser.email
  })
}

module.exports = dump

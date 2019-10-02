'use strict'

const path   = require('path')
const assert = require('assert')

const paths = require('./paths')

describe('paths tests', () => {
  it('check merchantIconsPath', () => {
    const result = paths.MERCHANT_ICONS_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/public/assets/merchant/merchant_icons')
  })

  it('check categoryIconsPath', () => {
    const result = paths.CATEGORY_ICONS_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/public/assets/merchant/merchant_categories_icons')
  })

  it('check businessLogicDataPath', () => {
    const result = paths.BUSINESS_LOGIC_DATA_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/businesslogic/data')
  })

  it('check exportHistoryPath', () => {
    const result = paths.EXPORT_HISTORY_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/public/export/history')
  })

  it('check mobileAppMediaPath', () => {
    const result = paths.MOBILE_APP_MEDIA_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/public/mobile-app-media')
  })

  it('check profileImagesPath', () => {
    const result = paths.PROFILE_IMAGES_PATH.split(path.sep).join('/')

    assert.strictEqual(result, 'files/public/profileImage')
  })
})
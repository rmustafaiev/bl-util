'use strict'

const assert = require('assert')

/**
 * @param {Request} req
 * @param {Context} context
 * @returns {Object}
 */
module.exports = (req, context) => ({ //eslint-disable-line

  async getRoleId(name) {
    const role = await this.getRoles().then(roles => roles.find(role => role.rolename === name))

    assert(role, `${name} role doesn't exist`)

    return role.roleId
  },

  getRoles() {
    return req.get('security/roles')
  },

  addRole(name) {
    return req.put(`security/roles/${encodeURIComponent(name)}`)
  },

  deleteRole(roleId) {
    return req.delete(`security/roles/${roleId}`)
  },

  /**
   * @param {String[]} users
   * @param {Object} roles
   * @returns {Promise|*}
   */
  updateAssignedUserRoles(users, roles) {
    return req.put('security/assignedroles', { users, roles })
  },

  /**
   * @param {String} tableId
   * @param {String} userId
   * @param {Object} permissions
   * @returns {Promise|*}
   */
  setUserPermissions(tableId, userId, permissions) {
    return req.put(`security/data/${tableId}/users/${userId}`, { permissions })
  }

})

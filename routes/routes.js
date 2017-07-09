var userController = require('../controllers/user');
var opportunitiesController = require('../controllers/opportunities');
var groupsController = require('../controllers/groups');
var membersController = require('../controllers/members');
var chatController = require('../controllers/chat');
var authController = require('../controllers/auth');

module.exports = (function() {
    'use strict';
    var router = require('express').Router();

    router.route('/signin').post(authController.authenticate);
    router.route('/signup').post(authController.signup);

    router.route('/me').get(authController.ensureAuthorized, authController.me);

    router.route('/users')
      .post(userController.postUser)
      .get(authController.ensureAuthorized, userController.getUser)
      .delete(userController.deleteUser)
      .put(userController.putUser);

    router.route('/opportunities')
      .post(authController.ensureAuthorized, opportunitiesController.postOpportunities)
      .get(opportunitiesController.getOpportunities)
      .delete(authController.ensureAuthorized, opportunitiesController.deleteOpportunities)
      .put(authController.ensureAuthorized, opportunitiesController.putOpportunities);

    router.route('/opportunities/join')
      .post(authController.ensureAuthorized, opportunitiesController.joinOpportunites)
    router.route('/opportunities/leave')
      .post(authController.ensureAuthorized, opportunitiesController.leaveOpportunities)
    router.route('/opportunities/remove-member')
      .post(authController.ensureAuthorized, opportunitiesController.removeMemberFromOpportunites)
    router.route('/opportunities/invite')
      .post(authController.ensureAuthorized, opportunitiesController.inviteToOpportunites)

    router.route('/groups')
      .post(authController.ensureAuthorized, groupsController.postGroups)
      .get(groupsController.getGroups)
      .delete(authController.ensureAuthorized, groupsController.deleteGroups)
      .put(authController.ensureAuthorized, groupsController.putGroups);

    //@TODO: Should we have the :id param in these? Maybe not if we want to support batch.
    router.route('/groups/join')
      .post(authController.ensureAuthorized, groupsController.joinGroups)
    router.route('/groups/leave')
      .post(authController.ensureAuthorized, groupsController.leaveGroups)
    router.route('/groups/remove-member')
      .post(authController.ensureAuthorized, groupsController.removeMemberFromGroups)
    router.route('/groups/invite')
      .post(authController.ensureAuthorized, groupsController.inviteToGroups)

    router.route('/members')
      .post(authController.ensureAuthorized, membersController.postMembers)
      .get(authController.ensureAuthorized, membersController.getMembers)
      .delete(authController.ensureAuthorized, membersController.deleteMembers)
      .put(authController.ensureAuthorized, membersController.putMembers);

    router.route('/chat')
      .post(authController.ensureAuthorized, chatController.postChat)
      .get(authController.ensureAuthorized, chatController.getChat)
      .delete(authController.ensureAuthorized, chatController.deleteChat)
      .put(authController.ensureAuthorized, chatController.putChat);

    return router;
})();

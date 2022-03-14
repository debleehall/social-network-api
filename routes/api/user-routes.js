const router = require('express').Router();

const {
    getAllUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    createFriend,
    deleteFriend
} = require('../../controllers/user-controllers');

router.route('/').get(getAllUser).post(createUser);

router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

router.route('/:userId/friends').post(createFriend);

router.route('/:id/friends/:friendId').delete(deleteFriend);

module.exports = router;
const { User } = require('../models');

const userController = {
    // get all users
    getAllUser(req, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

    // get one user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .select('-__v')
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User exists with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    },

    // update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User exists with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    // delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No User exists with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    //add friend
    createFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Delete friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId } })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User with this particular ID!' });
                    return;
                }
                return User.findById(params.id);
            })
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
};

module.exports = userController;
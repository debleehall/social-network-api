const { Thought } = require("../models");

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .select("-__v")
            .sort({ _id: -1 })
            .then((dbThoughtData) => res.json(dbThoughtData))
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought exists with this id." });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create new thoughts
    createThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return Users.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res
                        .status(404)
                        .json({ message: "No thoughts with this particular ID!" });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => res.json(err));
    },

    // Update a thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: "No thought exists with this id." });
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Delete a thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                    return res
                        .status(404)
                        .json({ message: "No thought exists with this id." });
                }
                return User.findOneAndUpdate(
                    { username: dbThoughtData.username },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user exists with this id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Add a reaction
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user exists with this id." });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    
    // Delete a reaction by ID
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { _id: params.reactionId } } },
            { safe: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No thoughts exist with this ID!" });
                    return;
                }
                return Thought.findById(params.thoughtId);
            })
            .then((dbUserData) => {
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },
};

// Export the controller
module.exports = thoughtController;
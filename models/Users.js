const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
    {
        username:{},
        email: {},
        thoughts: {},
        friends: {}
    }
);

UserSchema.virtual('friendCount').get(function() {
    return this.friends.reduce(
        (total, friend) => total + friend.replies.legth +1,
        0
    );
});

const User = model('User', UserSchema);

module.exports = User;
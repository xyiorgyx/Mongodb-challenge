const User = require("../models/User");


module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params._id })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  //update User
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params._id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },


  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Delete a user and remove them from the course
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params._id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'user and all thoughts have been deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  //Add friend tro
  addFriend(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);
    User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $addToSet: { friends: req.body } },
      { runValidators: true, new: true }
    )
      .then((friend) =>
        !friend
          ? res
            .status(404)
            .json({ message: 'No friend found with that ID :(' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $pull: { friends: { friendId: req.params.friendId } } },
      { runValidators: true, new: true }
    )
      .then((friend) =>
        !friend
          ? res
            .status(404)
            .json({ message: 'No friend found with that ID :(' })
          : res.json(friend)
      )
      .catch((err) => res.status(500).json(err));
  },
};
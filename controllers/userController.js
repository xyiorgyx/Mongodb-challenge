const {User, Thought} = require("../models");
const { ObjectId } = require("mongoose").Types;

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
      .populate('thoughts')
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

  // Delete a user and their thoughts from the API
  deleteUser(req, res) {
    User.findOneAndDelete({_id: req.params._id })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({_id: {$in: user.thoughts } })
      )
      .then(() => res.json({ message: 'user and all thoughts have been deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  //Add friend tro
  addFriend({params},res) {
    User.findOneAndUpdate(
      {_id: params.userId},
      {$addToSet: {friends:params.friendId }},
      {new: true}
    )
    .select('-__v')
    .populate('friends')
    .then((user) => 
    !user 
      ? res.status(404).json({ message: 'No user to add friend to found with that id.' })
      : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err)
      });
  },
  // Remove friend from a user
  removeFriend({params},res) {
    User.findOneAndUpdate(
      {_id: params.userId},
      {$pull: {friends:params.friendId }},
      {runValidators: true, new: true}
    )
    .select('-__v')
    .populate('friends')
    .then((user) => 
    !user 
      ? res.status(404).json({ message: 'No user found with that ID' })
      : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err)
      });
  }
};
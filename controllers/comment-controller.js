const { Pizza, Comment } = require('../models')

const commentController = {
    addComment({ params, body }, res) {
        console.log(body)
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $push: { comments: _id } },
                { new: true }
            )
        })
        .then(pizzaData => {
            if (!pizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' })
                console.log('==============', pizzaData)
                return
            }
            res.json(pizzaData)
        })
        .catch(err => {
            res.json(err)
        })
    },

    removeComment({params}, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id' })
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                { $pull: { comments: params.commentId } },
                { new: true }
            )
        })
        .then(pizzaData => {
            if (!pizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' })
                return
            }
            res.json(pizzaData)
        })
        .catch(err => console.log(err))
    }
}

module.exports = commentController
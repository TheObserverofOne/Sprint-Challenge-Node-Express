const express = require('express');

const actionModel = require('../data/helpers/actionModel');

const config = require('../api/config.js');

const router = express.Router();

router.get(`/`, (req, res) => {
  actionModel
    .get()
    .then(actions => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({ errorMessage: `Actions do not exist.` });
      }
    })
    .catch(error => res.status(500).json(error));
});

router.get(`/:id`, (req, res) => {
  const { id } = req.params;
  actionModel
    .get(id)
    .then(action => {
      if (Object.keys(action).length > 0) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ errorMessage: `The specified action does not exist.` });
      }
    })
    .catch(error => res.status(500).json(error));
});

router.post(`/`, (req, res) => {
  const newAction = req.body !== undefined ? req.body : {};

  if (newAction.project.id === undefined) {
    return res.status(400).json({ errorMessage: `A project id is needed.` });
  }

  if (!Number(newAction.project.id)) {
    return res.status(400).json({ errorMessage: `Please enter a number only` });
  }

  if (newAction.description === undefined) {
    return res.status(400).json({ errorMessage: `Provide a description for the action.` });
  }

  if (newAction.description.length > 128) {
    return res.status(400).json({ errorMessage: `Please keep description under 128 characters.`});
  }

  const posted = newAction.posted !== undefined ? newAction.posted : false;
  const actionPosts = newAction.actionPosts !== undefined ? newAction.actionPosts : '';

  const actions = Object.assign(newAction, {
    posted: posted,
    actionPosts: actionPosts,
  });

  actionModel
    .insert(actions)
    .then(response => {
      actionModel.get(response.id)
      .then(action => {
        if (Object.keys(action).length > 0) {
          res.status(200).json(action);
        } else {
          res.status(404).json({ errorMessage: `The action could not be created.` });
        }
      });
    })
    .catch(error => res.status(500).json(error));
});

router.put(`/:id`, (req, res) => {
  const { id } = req.params;
  const actionUpdates = req.body ? req.body : {};

  actionModel
    .update(id, actionUpdates)
    .then(updates => {
      if (Object.keys(updates).length > 0) {
        res.status(200).json(updates);
      } else {
        res.status(404).json({ errorMessage: `The action could not update.` }); /
      }
    })
    .catch(error => res.status(500).json(error));
});

router.delete(`/:id`, (req, res) => {
  const { id } = req.params;

  actionModel
    .get(id)
    .then(response => {
      if (Object.keys(response).length > 0) {
        const action = Object.assign(response);
        actionModel.remove(id).then(count => {
          res.status(200).json(action); 
        });
      } else {
        res.status(404).json({ errorMessage: `The action was not deleted.` }); /
      }
    })
    .catch(error => res.status(500).json(error));
});

module.exports = router;

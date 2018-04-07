const express = require('express');

const actionModel = require('../data/helpers/actionModel');

const config = require('../api/config.js');

const router = express.Router();


router.get(`/:id?`, (req, res) => {
  const { id } = req.params
  actionModel
    .get(id || '')
    .then(actions => {
      if (Array.isArray(actions) && actions.length < 1) return res.status(404).json({ errorMessage: `Actions do not exist.` });
      res.status(200).json(actions);
    })
    .catch(error => res.status(500).json(error));
});

router.post(`/`, (req, res) => {
  const newAction = req.body;

  if (newAction.project_id === undefined) {
    return res.status(400).json({ errorMessage: `A project id is needed.` });
  }

  if (isNaN(newAction.project_id)) {
    return res.status(400).json({ errorMessage: `Please enter a number only` });
  }

  if (newAction.description === undefined) {
    return res.status(400).json({ errorMessage: `Provide a description for the action.` });
  }

  if (newAction.description.length > 128) {
    return res.status(400).json({ errorMessage: `Please keep description under 128 characters.`});
  }

  const completed = newAction.completed !== undefined ? newAction.completed : false;
  const notes = newAction.notes !== undefined ? newAction.notes : '';

  const actions = { ...newAction, completed, notes };

  actionModel
    .insert(actions)
      res.redirect(`/api/actions/${id}`);
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
        res.status(404).json({ errorMessage: `The action could not update.` });
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
        res.status(404).json({ errorMessage: `The action was not deleted.` });
      }
    })
    .catch(error => res.status(500).json(error));
});

module.exports = router;

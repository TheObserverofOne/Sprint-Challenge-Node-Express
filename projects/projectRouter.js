const express = require('express');

const projectModel = require('../data/helpers/projectModel');

const config = require('../api/config.js');

const router = express.Router();


router.get(`/`, (req, res) => {
  projectModel
    .get()
    .then(projects => {
      if (projects.length > 0) {
        res.status(200).json(projects);
      } else {
        res.status(404).json({ errorMessage: `No projects.` });
      }
    .catch(error => res.status(500).json(error));
    });
});

router.get(`/:id`, (req, res) => {
  const { id } = req.params;

  projectModel
    .get(id)
    .then(project => {
      if (Object.keys(project).length > 0) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ errorMessage: `Project not found` }); 
      }
    .catch(error => res.status(500).json(error));
    });
});

router.get(`/:id/actions`, (req, res) => {
  const { id } = req.params;

  projectModel
    .getProjectActions(id)
    .then(actions => {
      if (actions.length > 0) {
        res.status(200).json(actions);
      } else {
        res.status(404).json({ message: `No actions found!` });
      }
    })
    .catch(error => res.status(500).json(error));
});


router.post(`/`, (req, res) => {
  const newProject = req.body !== undefined ? req.body : {};

  if (newProject.name === undefined && newProject.description === undefined) {
    return res.status(400).json({ errorMessage: `A project name and description is required.` });
  }

  if (newProject.name.length > 128 && newProject.description.length > 128) {
    return res.status(400).json({ errorMessage: `Please keep project name and description under 128 characters`});
  }

  const completed = newProject.completed !== undefined ? newProject.completed : false;
  const project = Object.assign(newProject, { completed: completed });

  projectModel
    .insert(project)
    .then(response => {
      projectModel.get(response.id)
      .then(proj => {
        if (Object.keys(proj).length > 0) {
          res.status(200).json(proj);
        } else {
          res.status(404).json({ errorMessage: `The project could not be created.` }); 
        }
      });
    })
    .catch(error => res.status(500).json(error));
});

router.put(`/:id`, (req, res) => {
  const { id } = req.params;
  const updateProject = req.body ? req.body : {};

  projectModel
    .update(id, updateProject)
    .then(updated => {
      if (Object.keys(updated).length > 0) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ errorMessage: `The project could not be updated.` }); 
      }
    })
    .catch(error => res.status(500).json(error));
});

router.delete(`/:id`, (req, res) => {
  const { id } = req.params;

  projectModel
    .get(id)
    .then(response => {
      if (Object.keys(response).length > 0) {
        const project = Object.assign(response);

        projectModel.remove(id)
        .then(response => {
          res.status(200).json(project); 
        });
      } else {
        res.status(404).json({ errorMessage: `The project could not be deleted.` }); 
      }
    })
    .catch(error => res.status(500).json(error));
});

module.exports = router;

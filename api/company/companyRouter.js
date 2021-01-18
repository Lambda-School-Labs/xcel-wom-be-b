const express = require('express');
const authRequired = require('../middleware/authRequired');
const Companies = require('./companyModel');
const router = express.Router();

router.get('/', authRequired, function (req, res) {
  Companies.findAll()
    .then((companies) => {
      res.status(200).json(companies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Companies.findById(id)
    .then((company) => {
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(404).json({ error: 'CompanyNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/:companyId/roles', authRequired, function (req, res) {
  const id = req.params.companyId;
  if (id > 0) {
    Companies.findCompanyRoles(id)
      .then((roles) => {
        if (roles.length > 0) {
          res.status(200).json(roles);
        } else {
          res.status(404).json({ error: 'Not Found' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else if (process.env.NODE_ENV === 'development') {
    // on the development server, `/company/0/roles` will give you all roles
    Companies.findAllRoles()
      .then((roles) => {
        if (roles.length > 0) {
          res.status(200).json(roles);
        } else {
          res.status(404).json({ error: 'No roles found' });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ message: err.message });
        res.status(500).json({ error: err.message });
      });
  }
});

router.get('/roles/:code', authRequired, async (req, res) => {
  const code = String(req.params.code);
  Companies.findRoleByCode(code)
    .then((role) => {
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ error: 'RoleNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', authRequired, async (req, res) => {
  const company = req.body;
  if (company) {
    const id = company.id || 0;
    try {
      await Companies.findById(id).then(async (cp) => {
        if (cp == undefined) {
          //company not found so lets insert it
          await Companies.create(company).then((company) => {
            console.log(company);
            res
              .status(200)
              .json({ message: 'company created', company: company[0] });
          });
        } else {
          res.status(400).json({ message: 'company already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Company missing' });
  }
});

router.put('/', authRequired, function (req, res) {
  const company = req.body;
  if (company) {
    const id = company.id || 0;
    Companies.findById(id)
      .then(
        Companies.update(id, company)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'company created', company: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update company '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find company '${id}'`,
          error: err.message,
        });
      });
  }
});

router.delete('/:id', authRequired, function (req, res) {
  const id = req.params.id;
  try {
    Companies.findById(id).then((company) => {
      Companies.remove(company.id).then(() => {
        res
          .status(200)
          .json({ message: `Company '${id}' was deleted.`, company: company });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete company with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;

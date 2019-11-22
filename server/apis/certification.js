module.exports = (function certificationAPI() {
  const express = require('express');
  const router = express.Router();
  const multer = require('multer');
  const fileManager = require('../utils/file_manager');

  const storageCertification = fileManager.uploader(1000000, 'documents/certification', {req:'query', suffix_name: 'doc_name'});

  const uploadCertification = multer({ storage: storageCertification });

  return function userRouter(db) {
    const certificationModel = require('../models/certificationModel')(db.connection);
    
    // get all certifications type for the back office
    router.get('/certification/type', (req, res) => {
      certificationModel.getCertifications_type(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      });
    });
    
    router.get('/certification/state', (req, res) => {
      certificationModel.getCertification_state(function(err, result) {
        if (err) return res.status(500).send(err);
        if(result.length > 0) {
          res.status(200).send({data: result[0].state});
        } else {
          res.status(200).send({data: 0});
        }
      }, req.query);
    });

    router.get('/certification/statement', (req, res) => {
      certificationModel.getStatement(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.query);
    });

    router.get('/certification/file', (req, res) => {
      certificationModel.getFile(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.query);
    });
    
    router.get('/certification/validation/user/:id', (req, res) => {
      certificationModel.getValidationCertificationUser(function(err, result) {
        if (err) return res.status(500).send(err);
        console.log(result);
        res.status(200).send(result);
      }, {id_user: req.params.id});
    });

    router.delete('/certification/file', (req, res) => {
      const path = "documents/certification/";
      fileManager.removeFile(path + req.query.file, function () {
        certificationModel.deleteFile(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send(result);
        }, req.query);
      });
    });
    
    router.post('/certification/statement', (req, res) => {
      certificationModel.postStatement(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.body);
    });


    // Post certification document
    router.post(
      '/certification/file',
      uploadCertification.single('uploaderDocProfil'),
      (req, res) => {
        console.log('file',req.file)
        const fileNameRegex = new RegExp("(^[1-9][0-9]{12})"+ "(_" + req.query.doc_name +".)"+"(jpeg|jpg|png|pdf)$");
        if (req.file.filename.match(fileNameRegex)) {
          if(req.query.page) {
            certificationModel.uploadDocProfil(
              function(err, result) {
                if (err) return res.status(500).send(err)
                res.status(200).send(req.file.filename)
              },
              {
                file: req.file.filename,
                id_user: req.query.id_user,
                id_certif: req.query.id_certif,
                page: req.query.page
              }
            )
          } else {
            certificationModel.uploadDocProfil(
              function(err, result) {
                if (err) return res.status(500).send(err)
                res.status(200).send(req.file.filename)
              },
              {
                file: req.file.filename,
                id_user: req.query.id_user,
                id_certif: req.query.id_certif
              }
            )

          }
        } else return res.status(500).send(`Le fichier n'est pas valide`)
      }
    )
    // Update certification document
    router.put(
      '/certification/file',
      uploadCertification.single('uploaderDocProfil'),
      (req, res) => {
        const fileNameRegex = new RegExp("(^[1-9][0-9]{12})"+ "(_" + req.query.doc_name +".)"+"(jpeg|jpg|png|pdf)$");
        if (req.file.filename.match(fileNameRegex)) {
          certificationModel.updateDocProfil(
            function(err, result) {
              if (err) return res.status(500).send(err)
              const path = "documents/certification/";
              fileManager.removeFile(path + req.query.file, function () {
                res.status(200).send(req.file.filename)
              })
            },
            {
              file: req.file.filename,
              id_user: req.query.id_user,
              id_certif: req.query.id_certif
            }
          )
        } else return res.status(500).send(`Le fichier n'est pas valide`)
      }
    )

    router.put('/certification/statement', (req, res) => {
      certificationModel.editStatement(function(err, result) {
        if (err) return res.status(500).send(err);
        res.status(200).send(result);
      }, req.body);
    });
    
    router.put('/certification/file', (req, res) => {
      const path = "documents/certification/";
      fileManager.removeFile(path + req.query.file, function () {
        certificationModel.editFile(function(err, result) {
          if (err) return res.status(500).send(err);
          res.status(200).send(result);
        }, req.body.file);
      });
    });

    return router;
  };
})();

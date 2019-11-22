module.exports = (function uploader() {
  const multer = require('multer');
  const fs = require('fs-extra');
  /**
   * @function
   * @module authenticate a middleware to use in express routes
   * @param {Object} req an express http request object
   * @param {Object} res an express http response object
   * @param {Function} next a function allowing to go back to initial express route callback
   * @param {Number} filesize to limit the size of the file
   * @param {String} pathToUpload to store in the right folder
   * @param {Query} suffix_name to store with the right name to avoid duplicated files
   * @return {undefined} the storage
   */
  const uploader = function uploader(filesize, pathToUpload, suffix_data) {
    const storage = multer.diskStorage({
      destination: function(req, file, cb) {
        // Chemin de destination selon l'environnement
        let path;
        if (process.env.NODE_ENV === 'development') {
          path = `static/${pathToUpload}`
        } else {
          path = `./matrimonline.fr/${pathToUpload}`
        }
        fs.mkdirsSync(path)
        cb(null, path)
      },
      filename: function(req, file, cb) {
        let suffix_name
        // Si le nom du fichier vient du req, l'utiliser sinon prendre le nom inséré
        if(suffix_data.req && suffix_data.req !== null) {
          suffix_name = req[suffix_data.req][suffix_data.suffix_name]
        } else {
          suffix_name = suffix_data.suffix_name
        }
        cb(
          null,
            Date.now() +
            `_${suffix_name}.` +
            (file.originalname.split('.').pop()
          ).toLowerCase()
          )
        },
        limits: { fileSize: filesize }
      })
      return storage;
    };
    
    const removeFile = function removeFile(pathToRemove, clbk) {
      let path;
      if (process.env.NODE_ENV === 'development') {
        path = `static/${pathToRemove}`
      } else {
        path = `./matrimonline.fr/${pathToRemove}`
      }
      // console.log('path', path)
      if (fs.existsSync(path)){
        fs.unlink(path, (err) => {
          if (err) {
            console.error(err)
            return err
          }
          clbk()
          return "removed";
        })
      } else {
        clbk()
        return "already removed";
      }
    }
    
    
  return {
    uploader,
    removeFile
  };
})();

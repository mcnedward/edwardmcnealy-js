const express = require('express'),
      iiRouteController = require('./iiRouteController'),
      parserRouteController = require('./parserRouteController'),
      colorZoneRouteController = require('./colorZoneRouteController'),
      apodRouteController = require('./apodRouteController'),
      numberPrinterRouteController = require('./numberPrinterRouteController'),
      contactRouteController = require('./contactRouteController'),
      recaptchaRouteController = require('./recaptchaRouteController'),
      router = express.Router();

// These are all API routes, so to call them the url would start with /api (See server.js for the setup)

router.route('/ii/app').get(recaptchaRouteController.verifyAndContinue, iiRouteController.app);
router.route('/ii/lib').get(recaptchaRouteController.verifyAndContinue, iiRouteController.library);

router.route('/parser/files').post(parserRouteController.files);
router.route('/parser/parse').post(parserRouteController.parse);
router.route('/parser/progress').post(parserRouteController.progress);

router.route('/color-zones/map').get(colorZoneRouteController.map);
router.route('/color-zones/map-bounds').get(colorZoneRouteController.mapBounds);
router.route('/color-zones/polygons/:zone').get(colorZoneRouteController.polygons);
router.route('/color-zones/hover-regions').get(colorZoneRouteController.hoverRegions);

router.route('/apod').get(apodRouteController.apod);

router.route('/number-printer').get(numberPrinterRouteController.convert);

router.route('/contact').post(recaptchaRouteController.verifyAndContinue, contactRouteController.contact);

router.route('/recaptcha/verify').post(recaptchaRouteController.verify);

module.exports = router;
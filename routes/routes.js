const express = require('express'),
      iiRouteController = require('./iiRouteController'),
      parserRouteController = require('./parserRouteController'),
      colorZoneRouteController = require('./colorZoneRouteController'),
      numberPrinterRouteController = require('./numberPrinterRouteController'),
      recaptchaRouteController = require('./recaptchaRouteController'),
      router = express.Router();

router.route('/ii/app').get(recaptchaRouteController.verifyAndContinue, iiRouteController.app);
router.route('/ii/lib').get(recaptchaRouteController.verifyAndContinue, iiRouteController.library);

router.route('/parser/files').post(parserRouteController.files);
router.route('/parser/parse').post(parserRouteController.parse);
router.route('/parser/progress').post(parserRouteController.progress);

router.route('/color-zones/map').get(colorZoneRouteController.map);
router.route('/color-zones/map-bounds').get(colorZoneRouteController.mapBounds);
router.route('/color-zones/polygons/:zone').get(colorZoneRouteController.polygons);
router.route('/color-zones/hover-regions').get(colorZoneRouteController.hoverRegions);

router.route('/number-printer').get(numberPrinterRouteController.convert);

router.route('/recaptcha/verify').post(recaptchaRouteController.verify);

module.exports = router;
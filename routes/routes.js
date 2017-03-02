const express = require('express'),
      recaptchaRouteController = require('./recaptchaRouteController'),
      numberPrinterRouteController = require('./numberPrinterRouteController'),
      parserRouteController = require('./parserRouteController'),
      colorZoneRouteController = require('./colorZoneRouteController'),
      router = express.Router();

router.route('/recaptcha/verify').post(recaptchaRouteController.verify);

router.route('/parser/files').post(parserRouteController.files);
router.route('/parser/parse').post(parserRouteController.parse);
router.route('/parser/progress').post(parserRouteController.progress);

router.route('/color-zones/map').get(colorZoneRouteController.map);
router.route('/color-zones/map-bounds').get(colorZoneRouteController.mapBounds);
router.route('/color-zones/polygons/:zone').get(colorZoneRouteController.polygons);
router.route('/color-zones/hover-regions').get(colorZoneRouteController.hoverRegions);

router.route('/number-printer').get(numberPrinterRouteController.convert);

module.exports = router;
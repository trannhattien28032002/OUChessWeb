const router = require('express').Router();
const matchController = require('../controllers/matchController');
const middlewareController = require('../controllers/middlewareController');
const apiConstants = require('../configs/ApiConstant');

const matchRepository = require('../repositories/matchRepository');

router.get(apiConstants.API_GET_MATCH, matchController.getMatches);
router.post(apiConstants.API_SAVE_MATCH, matchController.saveMatch);
router.post(apiConstants.API_ADD_MATCH, matchController.addMatch);
router.patch(apiConstants.API_UPDATE_MATCH_BY_ID, matchController.updateMatch);
router.delete(apiConstants.API_DELETE_MATCH, async (req, res) => {
    try {
        const { matchId } = req.params;

        const deletedMatch = await matchRepository.deleteMatch(matchId);

        res.json(deletedMatch);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi trong quá trình xoá trận đấu.' });
    }
});
router.get(apiConstants.API_GET_MATCH_BY_ID, matchController.getMatchById);

module.exports = router;

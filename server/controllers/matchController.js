const matchService = require('../services/matchService');
const httpHandler = require('../helpers/httpHandler');
const matchRepository = require('../repositories/matchRepository');

const matchController = {
    getMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const match = await matchService.getMatch(matchId);

            if (!match) {
                httpHandler.Fail(res, {}, 'Không tìm thấy trận đấu');
            } else {
                httpHandler.Success(res, { match }, 'Tìm thấy thông tin trận đấu');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    getMatches: async (req, res) => {
        try {
            const matches = await matchService.getMatches();

            if (!matches) {
                httpHandler.Fail(res, {}, 'Không tìm thấy trận đấu');
            } else {
                httpHandler.Success(res, { matches }, 'Tìm thấy danh sách trận đấu');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    addMatch: async (req, res) => {
        try {
            const newMatchData = req.body;
            const match = await matchService.addMatch(newMatchData);

            if (!match) {
                httpHandler.Fail(res, {}, 'Thêm trận đấu không thành công');
            } else {
                httpHandler.Success(res, { match }, 'Thêm trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    updateMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const match = req.body.match;
            console.log(matchId + ' ' + match);

            const updatedMatch = await matchService.updateMatch(matchId, match);

            if (!updatedMatch) {
                httpHandler.Fail(res, {}, 'Cập nhật trận đấu không thành công');
            } else {
                httpHandler.Success(res, { updatedMatch }, 'Cập nhật trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    deleteMatch: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const deletedMatch = await matchService.deleteMatch(matchId);

            if (!deletedMatch) {
                httpHandler.Fail(res, {}, 'Xoá trận đấu không thành công');
            } else {
                httpHandler.Success(res, { deletedMatch }, 'Xoá trận đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    getMatchById: async (req, res) => {
        try {
            const matchId = req.params.matchId;
            const matches = await matchService.getMatchById(matchId);
            if (!matches) httpHandler.Fail(res, {}, 'Không tìm thấy thông tin trận đấu');
            else {
                httpHandler.Success(res, { matches }, 'Tìm thấy thông tin trận đấu');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi !!!');
        }
    },
    saveMatch: async (req, res) => {
        try {
            const matchInfo = req.body;
            console.log(req.body);
            const savedMatch = await matchRepository.saveMatch(matchInfo);

            if (!savedMatch) {
                httpHandler.Fail(res, {}, 'Lưu ván đấu thất bại');
            } else {
                httpHandler.Success(res, { savedMatch }, 'Lưu ván đấu thành công');
            }
        } catch (error) {
            httpHandler.Servererror(res, error.message, 'Đã xảy ra lỗi!!!');
        }
    },
};

module.exports = matchController;

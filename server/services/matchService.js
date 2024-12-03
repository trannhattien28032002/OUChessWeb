const matchRepository = require("../repositories/matchRepository");

const matchService = {
    getMatch: async (matchId) => {
        try {
            return await matchRepository.getMatch(matchId);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getMatches: async () => {
        try {
            return await matchRepository.getMatches();
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    addMatch: async (newMatchData) => {
        try {
            return await matchRepository.addMatch(newMatchData);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    updateMatch: async (matchId, updatedMatchData) => {
        try {
            return await matchRepository.updateMatch(matchId, updatedMatchData);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    deleteMatch: async (matchId) => {
        try {
            return await matchRepository.deleteMatch(matchId);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getMatchByPlayerID: async (playerID) => {
        return await matchRepository.getMatchByPlayerID(playerID);
    },
    getMatchById: async (matchId) => {
        try {
            return await matchRepository.getMatchById(matchId);
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    saveMatch: async (matchInfo) => {
        try {
            return await matchRepository.saveMatch(matchInfo);
        } catch (error) {
            return null;
        }
    }
};

module.exports = matchService;
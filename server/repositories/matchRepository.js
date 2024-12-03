const match = require('../models/match');

const matchRepository = {
    getMatch: async (matchId) => {
        try {
            const matchData = await match.findOne({ _id: matchId });
            return matchData;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    getMatches: async () => {
        try {
            const matches = await match.find({ state: null });
            return matches;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    addMatch: async (newMatchData) => {
        try {
            delete newMatchData._id;
            console.log(newMatchData);
            const newMatch = new match(newMatchData);
            const savedMatch = await newMatch.save();
            return savedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    updateMatch: async (matchId, updatedMatchData) => {
        try {
            const updatedMatch = await match.findOneAndUpdate(
                { _id: matchId },
                { $set: updatedMatchData },
                { new: true },
            );
            return updatedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    deleteMatch: async (matchId) => {
        try {
            const deletedMatch = await match.findByIdAndDelete(matchId);
            return deletedMatch;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    },
    getMatchByPlayerID: async (playerId) => {
        const matches = await match
            .find({
                $or: [{ whiteId: playerId }, { blackId: playerId }],
                state: { $ne: null },
            })
            .populate('whiteId')
            .populate('blackId');

        return matches;
    },
    getMatchById: async (matchId) => {
        try {
            const Match = await match.find({
                _id: matchId,
            });
            return Match;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    saveMatch: async (matchInfo) => {
        try {
            const _match = new match(matchInfo);
            const savedMatch = await _match.save();
            return savedMatch;
        } catch (error) {
            return null;
        }
    },
};

module.exports = matchRepository;

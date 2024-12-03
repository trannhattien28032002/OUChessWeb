import notify from "src/assets/sound/notify.mp3";
import start from "src/assets/sound/game-start.mp3";
import self_move from "src/assets/sound/move-self.mp3";
import opponent_move from "src/assets/sound/move-opponent.mp3";

const audio = new Audio();

export const playAudio = async (src: string) => {
    audio.src = src;
    audio.play().then(() => {
        audio.src = "";
        audio.pause();
    });
}

export const allyMove = () => {
    playAudio(self_move);
}

export const opponentMove = () => {
    playAudio(opponent_move);
}

export const joinRoom = () => {
    playAudio(notify);
}

export const leaveRoom = () => {

}

export const startGame = () => {
    playAudio(start);
}

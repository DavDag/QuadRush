export const Ui = {
    SetUiOverlayVisibility(visible: boolean) {
        document.getElementById('ui-overlay').style.display = visible ? 'flex' : 'none';
    },
    SetPauseOverlayVisibility(visible: boolean) {
        document.getElementById('pause-overlay').style.display = visible ? 'flex' : 'none';
    },
    SetGameOverOverlayVisibility(visible: boolean) {
        document.getElementById('game-over').style.display = visible ? 'flex' : 'none';
    },
    UpdateScore(score: number) {
        document.getElementById('score').innerText = score.toString();
        document.getElementById('game-over-score').innerText = score.toString();
    },
    UpdateHighScore(highScore: number, rank: number) {
        document.getElementById('high-score').innerText = highScore.toString();
        document.getElementById('rank').innerText = rank.toString();
    },
    UpdateTime(time: number, close: boolean) {
        // Format time as MM:SS:MS
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 100);

        // Update time display
        document.getElementById('time').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;

        // Add 'close' class if time is close to limit
        document.getElementById('time').classList.toggle('close', close);
    },
    UpdateTimeLimit(timeLimit: number) {
        // Format time as MM:SS:MS
        const minutes = Math.floor(timeLimit / 60);
        const seconds = Math.floor(timeLimit % 60);
        const milliseconds = Math.floor((timeLimit % 1) * 100);

        // Update time display
        document.getElementById('timelimit').innerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
    }
};

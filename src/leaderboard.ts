const token = 'dev_7c18eecf877e40839a54bc7dc74ce363'; // Game key from LootLocker.io

// Leaderboard APIs
const APIs = (pid: string) => ({
    LogInPlayer: async () => {
        return await fetch('https://api.lootlocker.io/game/v2/session/guest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                game_key: token,
                game_version: '1.0.0',
                player_identifier: pid
            })
        })
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem('session_token', data.session_token);
            sessionStorage.setItem('player_id', data.player_id);
            localStorage.setItem('player_identifier', data.player_identifier);
            console.debug('LogInPlayer:', data);
            return data;
        });
    },
    SubmitScore: async (score: number) => {
        return await fetch('https://api.lootlocker.io/game/leaderboards/24364/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': sessionStorage.getItem('session_token')
            },
            body: JSON.stringify({
                score: score
            })
        })
        .then(response => response.json())
        .then(data => {
            console.debug('SubmitScore:', data);
            return data;
        });
    },
    GetHighScore: async () => {
        return await fetch('https://api.lootlocker.io/game/leaderboards/24364/member/' + sessionStorage.getItem('player_id'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-session-token': sessionStorage.getItem('session_token')
            },
        })
        .then(response => response.json())
        .then(data => {
            console.debug('GetHighScore:', data);
            return data;
        });
    }
});

// Get player ID from local storage (if any)
const player_identifier = localStorage.getItem('player_identifier');

// Save player ID to local storage
localStorage.setItem('player_identifier', player_identifier);

// Log player ID to console (for debugging)
console.debug('Player ID:', player_identifier);

// Export leaderboard APIs
export const Leaderboard = APIs(player_identifier);

// Log in player and get high score
Leaderboard.LogInPlayer()
    .then(() => {
        Leaderboard.GetHighScore().then(res => {
            window["UpdateHighscoreUI"](res.score, res.rank);
        });
    });

# TheFloorIsLava

<a href="https://daviderisaliti.itch.io/quadrush">
  <img src="https://github.com/user-attachments/assets/259eb251-38ed-4a30-b65f-3e061338ab80" width="30px" alt="itch.io" />
</a>

<a href="https://itch.io/jam/scorejam31">
  <img src="https://scorespace.net/wp-content/uploads/2021/12/SS_LOGO_MAIN-mobile.png" width="50px" alt="scorespace.net" />
</a>

<a href="https://progetti-strani.github.io/TheFloorIsLava/">
  <img src="https://github.com/user-attachments/assets/865cf62a-7d87-478d-8a61-1b796e26b168" width="33px" alt="play" />
</a>
<br>

Submission to the _ScoreSpam GameJam #31_.

## Gameplay

a video will be here :)

## Score equation

*Score* is incremented **after** completing each level using the following equation:
```
score += (totaltime - timetaken) * (level + 1)
```
where _totaltime_ and _timetaken_ are in ms (milliseconds) and _level_ starts from 0.

*Highscore* & *Rank* are displayed using [LootLocker](https://lootlocker.com/) APIs.

## Local dev

Clone the repo and install node v20.<br>

Intall dependencies
```
npm install
```

To run it locally
```
npm run start:dev
```

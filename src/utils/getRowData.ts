import { GameLog } from "@/interfaces/GameLog";
import { Player } from "@/interfaces/Player";

export const getRowData = (game: GameLog, player: Player) => {
    if (player.position === "QUARTERBACK" && player.sport === "nfl") {
      // NFL Quarterback
      return [
        game.completions || 0,
        game.passingAttempts || 0,
        game.completionPercent || 0,
        game.passingYards || 0,
        game.passingYardsPerAttemptAverage || 0,
        game.passingTouchdowns || 0,
        game.interceptions || 0,
        game.sacks || 0,
        game.sackYards || 0,
        game.rushingAttempts || 0,
        game.rushingYards || 0,
        game.rushingYardsPerAttemptAverage || 0,
        game.rushingTouchdowns || 0,
        game.fumbles || 0,
      ];
    } else if (player.position === "RUNNING BACK" && player.sport === "nfl") {
      // NFL Running Back
      return [
        game.rushingAttempts || 0,
        game.rushingYards || 0,
        game.rushingYardsPerAttemptAverage || 0,
        game.rushingTouchdowns || 0,
        game.fumbles || 0,
        game.targets || 0,
        game.receptions || 0,
        game.receivingTouchdowns || 0,
      ];
    } else if (
      player.position === "WIDE RECEIVER" ||
      (player.position === "TIGHT END" && player.sport === "nfl")
    ) {
      // NFL Wide Receiver
      return [
        game.targets || 0,
        game.receptions || 0,
        game.receivingYards || 0,
        game.receivingTouchdowns || 0,
        game.rushingAttempts || 0,
        game.rushingYards || 0,
        game.rushingYardsPerAttemptAverage || 0,
        game.rushingTouchdowns || 0,
      ];
    } else if (player.sport === "nba") {
      // NBA
      return [
        game.minutesPlayed,
        game.points,
        `${game.fieldGoals?.made}/${game.fieldGoals?.taken}`,
        `${game.threePointFieldGoals?.made}/${game.threePointFieldGoals?.taken}`,
        `${game.freeThrows?.made}/${game.freeThrows?.taken}`,
        game.offensiveRebounds || 0,
        game.defensiveRebounds || 0,
        game.rebounds || 0,
        game.assists || 0,
        game.steals || 0,
        game.blocks || 0,
        game.personalFouls || 0,
        game.turnovers || 0,
        game.plusMinus,
      ];
    }
  };
  
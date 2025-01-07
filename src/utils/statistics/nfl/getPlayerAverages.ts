import { GameLog } from "@/interfaces/GameLog";


// Quarterback
export const getQuarterbackPassingAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalPassingYards = gameLogs.reduce((total, game) => {
      const passingYards = parseFloat(String(game.passingYards));
      if (!isNaN(passingYards)) {
        validGames += 1; // Count only valid games
        return total + passingYards;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalPassingYards / validGames : 0; // Avoid division by zero
  };

  export const getQuarterbackCompletionsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalCompletions= gameLogs.reduce((total, game) => {
      const completions = parseFloat(String(game.completions));
      if (!isNaN(completions)) {
        validGames += 1; // Count only valid games
        return total + completions;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalCompletions / validGames : 0; // Avoid division by zero
  };

  export const getQuarterbackRushingYardsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalRushingYards= gameLogs.reduce((total, game) => {
      const rushingYards = parseFloat(String(game.rushingYards));
      if (!isNaN(rushingYards)) {
        validGames += 1; // Count only valid games
        return total + rushingYards;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalRushingYards / validGames : 0; // Avoid division by zero
  };

// Running Back
export const getRunningBackRushingAttemptsAverage = (gameLogs: GameLog[]) => {
  let validGames = 0;

  const totalRushingAttempts= gameLogs.reduce((total, game) => {
    const rushingAttempts = parseFloat(String(game.rushingAttempts));
    if (!isNaN(rushingAttempts)) {
      validGames += 1; // Count only valid games
      return total + rushingAttempts;
    }
    return total; // Skip invalid games
  }, 0);

  return validGames > 0 ? totalRushingAttempts / validGames : 0; // Avoid division by zero
};

  export const getRunningBackRushingYardsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalRushingYards= gameLogs.reduce((total, game) => {
      const rushingYards = parseFloat(String(game.rushingYards));
      if (!isNaN(rushingYards)) {
        validGames += 1; // Count only valid games
        return total + rushingYards;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalRushingYards / validGames : 0; // Avoid division by zero
  };

  export const getRunningBackRushingYardsAttemptAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalRushingYardsPerAttempt= gameLogs.reduce((total, game) => {
      const rushingYardsPerAttempt = parseFloat(String(game.rushingYardsPerAttemptAverage));
      if (!isNaN(rushingYardsPerAttempt)) {
        validGames += 1; // Count only valid games
        return total + rushingYardsPerAttempt;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalRushingYardsPerAttempt / validGames : 0; // Avoid division by zero
  };

  // Wide Receiver
  export const getWideReceiverReceptionsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalReceptions= gameLogs.reduce((total, game) => {
      const receptions = parseFloat(String(game.receptions));
      if (!isNaN(receptions)) {
        validGames += 1; // Count only valid games
        return total + receptions;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalReceptions / validGames : 0; // Avoid division by zero
  };
  
  export const getWideReceiverReceivingYardsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalReceivingYards= gameLogs.reduce((total, game) => {
      const receivingYards = parseFloat(String(game.receivingYards));
      if (!isNaN(receivingYards)) {
        validGames += 1; // Count only valid games
        return total + receivingYards;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalReceivingYards / validGames : 0; // Avoid division by zero
  };

  export const getWideReceiverReceivingTouchdownsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalReceivingTouchdowns= gameLogs.reduce((total, game) => {
      const receivingTouchdowns = parseFloat(String(game.receivingTouchdowns));
      if (!isNaN(receivingTouchdowns)) {
        validGames += 1; // Count only valid games
        return total + receivingTouchdowns;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalReceivingTouchdowns / validGames : 0; // Avoid division by zero
  };

  //Tight End
  export const getTightEndReceptionsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalReceptions= gameLogs.reduce((total, game) => {
      const receptions = parseFloat(String(game.receptions));
      if (!isNaN(receptions)) {
        validGames += 1; // Count only valid games
        return total + receptions;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalReceptions / validGames : 0; // Avoid division by zero
  };
  
  export const getTightEndReceivingYardsAverage = (gameLogs: GameLog[]) => {
    let validGames = 0;
  
    const totalReceivingYards= gameLogs.reduce((total, game) => {
      const receivingYards = parseFloat(String(game.receivingYards));
      if (!isNaN(receivingYards)) {
        validGames += 1; // Count only valid games
        return total + receivingYards;
      }
      return total; // Skip invalid games
    }, 0);
  
    return validGames > 0 ? totalReceivingYards / validGames : 0; // Avoid division by zero
  };

  
  
  
import { Game } from "@/types/Game";
import React from "react";
import MatchupHeader from "../matchups/MatchupHeader";
import MatchupRow from "../matchups/MatchupRow";
import { useGame } from "@/hooks/useGame";

interface GamePreviewProps {
  game: Game;
  sport: string;
}

const GamePreview = ({ game, sport }: GamePreviewProps) => {
  const gameInfo = useGame(sport, game.webUrl);

  const Game = gameInfo.game;

  return (
    <>
    {Game ? (
      <div className="my-8 space-y-6 rounded-lg shadow-md justify-between w-full items-start">
      {/* Featured Pairing */}
      <div className="space-y-4">
        <div className="text-3xl mb-4">{Game?.featuredPairing?.title}</div>
        <div className="grid grid-cols-3">
          <div className="col-span-1 flex items-center flex-col justify-center">
            <a href={Game?.featuredPairing?.awayPlayer?.webUrl}>
              <img
                className="border rounded-full"
                width={72}
                src={Game?.featuredPairing?.awayPlayer?.image}
              />
            </a>
            {Game?.featuredPairing?.awayPlayer?.name}
            {Game?.featuredPairing?.awayPlayer?.stats?.map((stat: any, index: any) => (
              <React.Fragment key={index}>
                <p>{stat}</p>
              </React.Fragment>
            ))}
          </div>
          <div className="col-span-1 flex items-center justify-center text-2xl font-bold">
            VS
          </div>
          <div className="col-span-1 flex items-center flex-col justify-center">
            <a href={Game?.featuredPairing?.homePlayer?.webUrl}>
              <img
                className="border rounded-full"
                width={72}
                src={Game?.featuredPairing?.homePlayer?.image}
              />
            </a>
            {Game?.featuredPairing?.homePlayer?.name}
                        {Game?.featuredPairing?.homePlayer?.stats?.map((stat: any, index: any) => (
              <React.Fragment key={index}>
                <p>{stat}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Team Stats Comparison */}
      <div className="space-y-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="text-3xl mb-4">{Game?.teamStatsComparison?.title}</div>

        <div className="grid grid-cols-3 gap-y-3 gap-x-6 items-center">
          {/* Header with team logos and names */}
          <div className="col-span-1 flex items-center justify-end space-x-3 border-b border-gray-300 pb-3">
            <img
              width={40}
              height={40}
              className="rounded-full"
              src={Game?.teamStatsComparison?.awayTeam?.image}
              alt={`${Game?.teamStatsComparison?.awayTeam?.name} logo`}
            />
            <h1 className="text-xl font-semibold">
              {Game?.teamStatsComparison?.awayTeam?.name}
            </h1>
          </div>
          <div className="col-span-1 pb-3"></div>
          <div className="col-span-1 flex items-center space-x-3 border-b border-gray-300 pb-3">
            <img
              width={40}
              height={40}
              className="rounded-full"
              src={Game?.teamStatsComparison?.homeTeam?.image}
              alt={`${Game?.teamStatsComparison?.homeTeam?.name} logo`}
            />
            <h1 className="text-xl font-semibold">
              {Game?.teamStatsComparison?.homeTeam?.name}
            </h1>
          </div>

          {/* Stats rows */}
          {Game?.teamStatsComparison?.awayTeam?.stats?.map((stat, index) => (
            <React.Fragment key={index}>
              {/* Away team stat value, aligned right */}
              <div className="flex justify-end text-lg font-medium text-blue-600 border-b border-gray-200 py-2">
                {stat.value}
              </div>

              {/* Stat abbreviation, centered */}
              <div className="flex justify-center font-semibold text-gray-600 border-b border-gray-200 py-2">
                {stat.abbr}
              </div>

              {/* Home team stat value, aligned left */}
              <div className="flex justify-start text-lg font-medium text-red-600 border-b border-gray-200 py-2">
                {Game.teamStatsComparison?.homeTeam?.stats?.[index]?.value ??
                  ""}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Team Leaders Comparison */}
      <div className="space-y-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="text-3xl mb-4">
          {Game?.teamLeadersComparison?.title}
        </div>

        <div className="grid grid-cols-3 gap-y-3 gap-x-6 items-center">
          {/* Header with team logos and names */}
          <div className="col-span-1 flex items-center justify-end space-x-3 border-b border-gray-300 pb-3">
            <img
              width={40}
              height={40}
              className="rounded-full"
              src={Game?.teamLeadersComparison?.awayTeam?.image}
              alt={`${Game?.teamLeadersComparison?.awayTeam?.name} logo`}
            />
            <h1 className="text-xl font-semibold">
              {Game?.teamLeadersComparison?.awayTeam?.name}
            </h1>
          </div>
          <div className="col-span-1 pb-3"></div>
          <div className="col-span-1 flex items-center space-x-3 border-b border-gray-300 pb-3">
            <img
              width={40}
              height={40}
              className="rounded-full"
              src={Game?.teamLeadersComparison?.homeTeam?.image}
              alt={`${Game?.teamLeadersComparison?.homeTeam?.name} logo`}
            />
            <h1 className="text-xl font-semibold">
              {Game?.teamLeadersComparison?.homeTeam?.name}
            </h1>
          </div>

          {/* Stats rows */}
          {Game?.teamLeadersComparison?.awayTeam?.stats?.map((stat, index) => (
            <React.Fragment key={index}>
              {/* Away team stat value, aligned right */}
              <div className="flex flex-col text-end justify-end text-sm font-medium text-blue-600 border-b border-gray-200 py-2">
                <h1>{stat.name} </h1>
                <p className="text-lg">{stat.value}</p>
              </div>

              {/* Stat abbreviation, centered */}
              <div className="flex justify-center font-semibold text-gray-600 border-b border-gray-200 py-2">
                {stat.abbr}
              </div>

              {/* Home team stat value, aligned left */}
              <div className="flex flex-col justify-start text-sm font-medium text-red-600 border-b border-gray-200 py-2">
                <h1>
                  {Game?.teamLeadersComparison?.homeTeam?.stats?.[index]?.name}{" "}
                </h1>
                <p className="text-lg">
                  {Game.teamLeadersComparison?.homeTeam?.stats?.[index]
                    ?.value ?? ""}
                </p>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
    ) : (
      <div>Loading game preview...</div>
    )}
    </>
  );
};

export default GamePreview;

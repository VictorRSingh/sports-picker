import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Gamelog } from "@/types/Gamelog";
import { Player } from "@/types/Player";

interface AiPromptsProps {
  gameLogs: Gamelog;
  player: Player;
}

const AiPrompts = ({ gameLogs, player }: AiPromptsProps) => {
  const [response, setResponse] = useState<any>();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBRV9n6tEoOcMOEpehbv_AjtU6j3r5WLlM"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
  Here is the gamelog data for ${player.name}:
  ${JSON.stringify(gameLogs)}
  
  Using this data:
  1. Provide predictions or projections for the player's future performance.
  2. Return the data in a JSON format with this structure:
     [
         {
             "statName": "Stat Name",
             "projectedValue": Numeric Value
         }
     ]
  3. Ensure each stat is listed as a separate object in the array.
  4. Do not include any additional text or explanation outside the JSON.
  `;

  const fetchAiResponse = async () => {
    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    // Process the response to add newlines after each series of numbers
    const formattedResponse = rawResponse
      .replace("```json", "")
      .replace("```", "");

    setResponse(JSON.parse(formattedResponse));
  };

  useEffect(() => {
    if (response) {
      console.log(response);
    }
  }, [response]);

  useEffect(() => {
    fetchAiResponse();
  }, []);
  return (
    <div
      className="max-h-fill overflow-y-auto"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {response ? (
        <div>
          <div className="grid grid-cols-2 gap-4 items-center">
            {response.map(
              (stat: { statName: string; projectedValue: number }) => (
                <div
                  key={stat.statName}
                  className="flex flex-col p-4 border-b border-gray-700 col-span-full lg:col-span-1"
                >
                  <h1 className="text-xs font-semibold">{stat.statName}</h1>
                  <div className="flex items-center gap-x-4">
                    <h1 className="text-5xl">{stat.projectedValue.toFixed(1)}</h1>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        "Loading predictions..."
      )}
    </div>
  );
};

export default AiPrompts;

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { PlayerProps } from "@/types/PlayerProps";
import { Prop } from "@/types/Prop";
import { Sportsbook } from "@/types/Sportsbook";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const url = searchParams.get("url");

  try {
    if (!url) {
      return;
    }

    const response = await axios.get(url);
    const propsHtml = await response.data;

    if (propsHtml) {
      const $ = cheerio.load(propsHtml);
      const playerProps: PlayerProps[] = [];

      $(".covers-CoversMatchups-MainContentContainer")
        .find(".container")
        .find(".covers-CoversPlayer-Prop-Event")
        .each((_, section) => {
          const market = $(section).find("h2").text().trim();

          const playerProp: PlayerProps = {
            market: market,
            props: [],
          };

          $(section)
            .find(".covers-CoversPlayer-Prop-Card")
            .each((_, card) => {
              const odds = $(card)
                .find(".tab-content .tab-pane")
                .eq(1)
                .find(".other-odds-row");

              $(odds).each((_, row) => {
                const sportsbook: Sportsbook = {
                  name:
                    $(row)
                      .find(".other-odds-label a")
                      .find("img")
                      .attr("src")
                      ?.replace(".svg", "")
                      .split(
                        "https://img.covers.com/covers/data/sportsbooks/"
                      )[1] || "",
                  imageUrl:
                    $(row)
                      .find(".other-odds-label a")
                      .find("img")
                      .attr("src") || "",
                };

                const props: Prop = {
                  sportsbook: sportsbook,
                  over: {
                    line:
                      $(row)
                        .find(".other-over-odds a")
                        .text()
                        .match(/(?:o)?([+-]?\d+(\.\d+)?)/)?.[1] || "", // Include optional + or - sign
                    odd: $(row).find(".other-over-odds a span").text().trim(),
                  },
                  under: {
                    line:
                      $(row)
                        .find(".other-under-odds a")
                        .text()
                        .match(/(?:u)?([+-]?\d+(\.\d+)?)/)?.[1] || "", // Include optional + or - sign
                    odd: $(row).find(".other-under-odds a span").text().trim(),
                  },
                };

                playerProp.props.push(props);
              });
            });
          playerProps.push(playerProp)
        });
      return NextResponse.json(playerProps);
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false });
  }
}

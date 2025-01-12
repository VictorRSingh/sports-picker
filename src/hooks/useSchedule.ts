"use client";

import { DEBUG } from "@/config";
import { Schedule } from "@/interfaces/Schedule";
import axios from "axios";
import React, { useEffect, useState } from "react";

const useSchedule = (sport: string, formattedDate: string) => {
  const [schedule, setSchedule] = useState<Schedule>();

  const fetchSchedule = async () => {
    const apiRoute = `/api/foxsports/schedule?sport=${sport}&date=${formattedDate}`;

    try {
      const response = await axios.get(apiRoute);
      const data = response.data;
      setSchedule({ date: formattedDate, matchups: data });
    } catch (error) {
      console.error(`Error fetching schedule for ${sport}`);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [sport, formattedDate]);
  return { schedule, setSchedule };
};

export default useSchedule;

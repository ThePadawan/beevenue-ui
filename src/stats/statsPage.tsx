import React, { useEffect, useState } from "react";

import { Api } from "api";
import { useLoginRequired } from "../routing/loginRequired";
import { BeevenueSpinner } from "../beevenueSpinner";

import { Rating } from "api/show";

export type RatingStats = Record<Rating, number>;

interface InnerStatistics {
  ratings: RatingStats;
}

interface Stats {
  statistics: InnerStatistics;
}

const StatsPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  useLoginRequired();

  const loadStats = () => {
    Api.Stats.get().then((res) => {
      setStats(res.data.data);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getStats = (stats: Stats) => {
    const rows: JSX.Element[] = [];

    let total = 0;
    for (const untypedRating in stats.statistics.ratings) {
      const rating: Rating = untypedRating as Rating;
      if (rating === null) continue;
      total += stats.statistics.ratings[rating];
    }

    for (const untypedRating in stats.statistics.ratings) {
      const rating: Rating = untypedRating as Rating;
      if (rating === null) continue;

      rows.push(
        <tr key={rating}>
          <td>{rating}</td>
          <td>{stats.statistics.ratings[rating]}</td>
          <td>
            {((100 * stats.statistics.ratings[rating]) / total).toFixed(1)}
          </td>
        </tr>
      );
    }
    return (
      <table className="beevenue-table table">
        <thead>
          <tr>
            <th>Rating</th>
            <th># Media</th>
            <th>% of total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };

  let content: JSX.Element;
  if (stats === null) {
    content = <BeevenueSpinner />;
  } else {
    content = getStats(stats);
  }

  return (
    <>
      <h2 className="title is-2">Stats</h2>
      <h3 className="title is-3">Ratings</h3>
      {content}
    </>
  );
};

export { StatsPage };
export default StatsPage;

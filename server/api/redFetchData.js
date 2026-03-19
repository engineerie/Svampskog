// server/api/edibleFetchData.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";

const fetchEdibleDataFromDB = async ({
  geography,
  forestType,
  vegetationType,
  standAge,
}) => {
  const db = await open({
    filename: "./server/EDNAData.db",
    driver: sqlite3.Database,
  });

  // Updated query with additional WHERE conditions
  const query = `
  SELECT 
    m.Scientificname,
    m.Commonname,
    COALESCE(
  m.Commonname, 
  m.Nyttartnamn, 
  m.Släkte, 
  m.högrenivå,
  'Saknar svenskt namn'
) AS Commonname,
    m.Artfakta,
    m.RL2020kat,
    m.RL2020krit,
    m.Kriteriedokumentation,
    m."Svamp-grupp",
    m."Svamp-Undersvamp-grupp",
    m."SIGNAL_art",
    m.Svampguiden,
    m."Nyasvamp-boken",
    m."Norra Sverige",
    m."Södra Sverige",
    m.Gran,
    m.Tall,
    m."Blandad barrskog",
    m."Blandad lövskog",
    m.Lövskog,
    m.EkochBokskog,
    m.Naturbete,
    m."11-20 år",
    m."1-40 år",
    m."41-90 år",
    m."91 år och äldre",
    m."ÖRTER_grupp",
    m."BLÅBÄR_grupp",
    m."LINGON_grupp",
    m."OVANLIGHET",
    m."KALKmark",
    m."ANNANmark",
    m."RLochS",
    s.rating,
    m.ekologi AS ekologi,
    m."Rank rödlist o signal" AS RankRed,
    m."Giftsvamp" 
  FROM 
    "Mat_Naturvård_Gift_Jan_3" m
  LEFT JOIN svampguiden s ON m.taxon = s.taxonid
  WHERE 
    m."RLochS" IS NOT NULL
  `;

  const data = await db.all(query);

  await db.close();

  return data;
};

export async function fetchEdibleDataDirectly({
  geography,
  forestType,
  vegetationType,
  standAge,
}) {
  return fetchEdibleDataFromDB({
    geography,
    forestType,
    vegetationType,
    standAge,
  });
}

export default fetchEdibleDataDirectly;

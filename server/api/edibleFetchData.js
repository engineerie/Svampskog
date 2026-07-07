// server/api/edibleFetchData.js

import sqlite3 from "sqlite3";
import { open } from "sqlite";
import {
  pickColumnRef,
  quoteIdentifier,
  resolveSpeciesSourceSchema,
} from "../utils/speciesSourceSchema.js";

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
  const schema = await resolveSpeciesSourceSchema(db);
  const speciesTable = quoteIdentifier(schema.speciesTable);

  const kriteriedokumentationRef =
    pickColumnRef("m", schema.speciesColumns, ["Kriteriedokumentation2025"]) ||
    pickColumnRef("m", schema.speciesColumns, ["Kriteriedokumentation"]) ||
    "NULL";
  const ekologiRef =
    pickColumnRef("m", schema.speciesColumns, ["Ekologi2025", "ekologi 2025"]) ||
    pickColumnRef("m", schema.speciesColumns, ["ekologi"]) ||
    "NULL";
  const artfaktaRef =
    pickColumnRef("m", schema.speciesColumns, ["Artfakta_2025", "Artfakta 2025", "Artfakta"]) ||
    "NULL";
  const rlRef =
    pickColumnRef("m", schema.speciesColumns, ["RL2025kat", "RL2020kat"]) ||
    "NULL";
  const norrRef =
    pickColumnRef("m", schema.speciesColumns, ["Norra_Sverige", "Norra Sverige"]) ||
    "NULL";
  const soderRef =
    pickColumnRef("m", schema.speciesColumns, ["Södra_Sverige", "Södra Sverige"]) ||
    "NULL";
  const barrRef =
    pickColumnRef("m", schema.speciesColumns, ["Blandad_barrskog", "Blandad barrskog"]) ||
    "NULL";
  const lovRef =
    pickColumnRef("m", schema.speciesColumns, ["Blandad_lövskog", "Blandad lövskog"]) ||
    "NULL";
  const youngRef =
    pickColumnRef("m", schema.speciesColumns, ["11-20_år", "11-20 år"]) ||
    "NULL";
  const earlyRef =
    pickColumnRef("m", schema.speciesColumns, ["1-40_år", "1-40 år"]) ||
    "NULL";
  const middleRef =
    pickColumnRef("m", schema.speciesColumns, ["41-90_år", "41-90 år"]) ||
    "NULL";
  const oldRef =
    pickColumnRef("m", schema.speciesColumns, ["91_år_och_äldre", "91 år och äldre"]) ||
    "NULL";
  const rankMatsvampRef =
    pickColumnRef("m", schema.speciesColumns, ["Rank_matsvamp", "Rank matsvamp"]) ||
    "NULL";
  const rankGiftsvampRef =
    pickColumnRef("m", schema.speciesColumns, ["Rank_giftsvamp", "Rank giftsvamp"]) ||
    "NULL";

  // Updated query with additional WHERE conditions
  const query = `
  SELECT 
    m.Scientificname,
    m.Commonname,
    COALESCE(${artfaktaRef}, 'Information saknas') AS Artfakta,
    COALESCE(${rlRef}, '0') AS RL2020kat,
    m.RL2020krit,
    ${kriteriedokumentationRef} AS Kriteriedokumentation,
    m."Svamp-grupp",
    m."Svamp-Undersvamp-grupp",
    m."SIGNAL_art",
    m.Svampguiden,
    m."Nyasvamp-boken",
    ${norrRef} AS "Norra Sverige",
    ${soderRef} AS "Södra Sverige",
    m.Gran,
    m.Tall,
    ${barrRef} AS "Blandad barrskog",
    ${lovRef} AS "Blandad lövskog",
    m.Lövskog,
    m.EkochBokskog,
    m.Naturbete,
    ${youngRef} AS "11-20 år",
    ${earlyRef} AS "1-40 år",
    ${middleRef} AS "41-90 år",
    ${oldRef} AS "91 år och äldre",
    m."ÖRTER_grupp",
    m."BLÅBÄR_grupp",
    m."LINGON_grupp",
    m."KALKmark",
    m."ANNANmark",
    s.rating,
    ${ekologiRef} AS ekologi,
    m."Giftsvamp",
    ${rankMatsvampRef} AS "Rank matsvamp",
    ${rankGiftsvampRef} AS "Rank giftsvamp"
  FROM 
    ${speciesTable} m
  LEFT JOIN svampguiden s ON m.taxon = s.taxonid
  WHERE 
    m."Nyasvamp-boken" IS NOT NULL
    OR m."Giftsvamp" IS NOT NULL  `;

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

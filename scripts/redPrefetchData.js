// scripts/redPrefetchData.js

import { fetchEdibleDataDirectly } from "../server/api/redFetchData.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const geographyOptions = ["Norr", "Söder"];
const forestTypeOptions = [
  "Granskog",
  "Tallskog",
  "Barrblandskog",
  "Lövblandskog",
  "Lövskog",
  "EkBokskog",
  "Naturbete",
];
const vegetationTypeOptions = ["Örter_grupp", "Blåbär_grupp", "Lingon_grupp"];
const standAgeOptions = ["1-40", "41-90", "91", "allaåldrar"];
let allCombinations = [];

for (let geo of geographyOptions) {
  for (let forest of forestTypeOptions) {
    for (let veg of vegetationTypeOptions) {
      for (let age of standAgeOptions) {
        allCombinations.push({ geo, forest, veg, age });
      }
    }
  }
}

const mapGeographyToColumn = {
  Norr: "Norra Sverige",
  Söder: "Södra Sverige",
};

const mapForestTypeToColumn = {
  Granskog: "Gran",
  Tallskog: "Tall",
  Barrblandskog: "Blandad barrskog",
  Lövblandskog: "Blandad lövskog",
  Lövskog: "Lövskog",
  EkBokskog: "EkochBokskog",
  Naturbete: "Naturbete",
};

const mapVegetationTypeToColumn = {
  Örter_grupp: "ÖRTER_grupp",
  Blåbär_grupp: "BLÅBÄR_grupp",
  Lingon_grupp: "LINGON_grupp",
};

const mapStandAgeToColumn = {
  "1-40": "1-40 år",
  "41-90": "41-90 år",
  91: "91 år och äldre",
  allaåldrar: null,
};

// === IMAGE LOGIC START ===

// Helper: Compute image URLs for a given scientific name using the manifest
async function computeImages(scientificName, manifest) {
  if (!scientificName) return [];
  const cleanedName = scientificName
    .replace(/\s*s\.?\s*(lat\.?|str\.?)\s*$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  const foundImages = [];
  const searchFolders = ["Matsvampar", "Giftsvampar", "RödlistadeSvampar"];
  for (const folder of searchFolders) {
    const files = manifest[folder] || [];
    for (const file of files) {
      const base = file.replace(/\.(jpg|jpeg|png|webp)$/i, "");
      const [namePart] = base.split("-", 1);
      const cleanedNamePart = namePart
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
      if (cleanedNamePart.includes(",")) {
        const [nameA, nameB] = cleanedNamePart.split(",").map((s) => s.trim());
        if (nameA === cleanedName || nameB === cleanedName) {
          foundImages.push(`/images/SvampBilder/${folder}/${file}`);
        }
      } else if (cleanedNamePart === cleanedName) {
        foundImages.push(`/images/SvampBilder/${folder}/${file}`);
      }
    }
  }
  return foundImages;
}

// Read the manifest file directly from disk
const manifestPath = path.join(
  __dirname,
  "../public/imagemanifest/manifest.json",
);
let manifest = {};
try {
  const manifestData = fs.readFileSync(manifestPath, "utf8");
  manifest = JSON.parse(manifestData);
} catch (error) {
  console.error("Error reading manifest file:", error);
}

// === IMAGE LOGIC END ===

async function prefetchEdibleData() {
  for (const { geo, forest, veg, age } of allCombinations) {
    try {
      const data = await fetchEdibleDataDirectly({ geo, forest, veg, age });

      if (!data || data.length === 0) {
        console.log("No edible data fetched for combination", {
          geo,
          forest,
          veg,
          age,
        });
        continue;
      }

      const geographyColumn = mapGeographyToColumn[geo];
      const forestTypeColumn = mapForestTypeToColumn[forest];
      const vegetationTypeColumn = mapVegetationTypeToColumn[veg];
      const standAgeColumn = mapStandAgeToColumn[age];

      const enhancedData = data
        .filter(
          (item) =>
            item[geographyColumn] === "x" &&
            (forestTypeColumn === null || item[forestTypeColumn] !== null) &&
            vegetationTypeColumn !== null &&
            item[vegetationTypeColumn] !== null &&
            (standAgeColumn === null
              ? item["1-40 år"] !== null ||
                item["41-90 år"] !== null ||
                item["91 år och äldre"] !== null
              : item[standAgeColumn] !== null),
        )
        .map((item) => {
          const youngValue = item["11-20 år"] || 0;
          const forestValue = item[forestTypeColumn] || 0;

          let ageValue;
          if (standAgeColumn === null) {
            const a = item["1-40 år"] || 0;
            const b = item["41-90 år"] || 0;
            const c = item["91 år och äldre"] || 0;
            // Calculate average of the three, rounding to nearest integer
            ageValue = Math.round((a + b + c) / 3);
          } else {
            ageValue = item[standAgeColumn] || 0;
          }

          let förekomstSkogÅlder = forestValue + ageValue;
          let förekomstSum = forestValue + ageValue;

          // Adjust förekomst_sum based on age "1-40" and "11-20" value
          if (age === "1-40" && item["11-20 år"] === null) {
            förekomstSum -= 0.5;
          }

          return {
            ...item,
            förekomst_skog_ålder: förekomstSkogÅlder,
            förekomst_skog: forestValue,
            förekomst_ålder: ageValue,
            förekomst_ung: youngValue,
            förekomst_sum: förekomstSum,
          };
        });

      // Sort data by förekomst_sum in descending order
      enhancedData.sort((a, b) =>
        (a.Commonname || a.Scientificname || "").localeCompare(
          b.Commonname || b.Scientificname || "",
          "sv",
        ),
      );

      // Add computed image URLs to each entry
      const enhancedDataWithImages = await Promise.all(
        enhancedData.map(async (entry) => {
          const images = await computeImages(entry.Scientificname, manifest);
          return { ...entry, images };
        }),
      );

      const filename = `redlisted-${geo}-${forest}-${age}-${veg}.json`;
      fs.writeFileSync(
        path.join(__dirname, `../static/${filename}`),
        JSON.stringify(enhancedDataWithImages, null, 2), // Ensure the output is nicely formatted
      );
      console.log(`Redlisted data pre-fetching complete for ${filename}.`);
    } catch (error) {
      console.error(
        "Error during redlisted data prefetch for combination",
        { geo, forest, veg, age },
        ":",
        error,
      );
    }
  }
}

// Execute the prefetch function
prefetchEdibleData();

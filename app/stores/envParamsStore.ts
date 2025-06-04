// app/stores/envParamsStore.ts
import { defineStore } from "pinia";

// Export the options arrays so they can be imported elsewhere.
export const geographyOptions = [
  { value: "Norr", label: "Norra Sverige", description: "Norr om breddgrad 60°" },
  {
    value: "Söder",
    label: "Södra Sverige",
    description: "Söder om breddgrad 60°",
  },
];

export const forestTypeOptions = [
  {
    value: "Granskog",
    label: "Granskog",
    description: "Minst 70% barrträd, och minst 70% av dessa är gran",
  },
  {
    value: "Tallskog",
    label: "Tallskog",
    description: "Minst 70% barrträd, och minst 70% av dessa är tall",
  },
  {
    value: "Barrblandskog",
    label: "Barrblandskog",
    description: "Minst 70% barrträd, men varken tall eller gran uppnår 70%",
  },
  {
    value: "Lövblandskog",
    label: "Blandskog",
    description: "31-69% lövträd eller barrträd",
  },
  {
    value: "Lövskog",
    label: "Övrig lövskog",
    description: "Minst 70% lövträd",
  },
  {
    value: "EkBokskog",
    label: "Ek och Bokskog",
    description: "Minst 70% lövträd, och minst 70% av dessa är ek eller bok",
  },
  {
    value: "Naturbete",
    label: "Trädklädd betesmark",
    description: "Trädbevuxna gräsmarker som används för betesdjur",
  },
];

export const standAgeOptions = [
  {
    value: "1-40",
    label: "1-40 år",
    description: "Skogens medelålder är mellan 1 och 40 år",
  },
  {
    value: "41-90",
    label: "41-90 år",
    description: "SKogens medelålder är mellan 41 och 90 år",
  },
  {
    value: "91",
    label: "91 år och äldre",
    description: "Skogens medelålder är äldre än 90 år",
  },
  {
    value: "allaåldrar",
    label: "Alla åldrar",
    description: "Inkluderar skogar med alla trädmedelåldrar",
  },
];

export const vegetationTypeOptions = [
  {
    value: "Örter_grupp",
    label: "Örttyper",
    description:
      "Näringsrik mark med fältskikt som innehåller högörter, lågörter och bredbladiga gräs",
  },
  {
    value: "Blåbär_grupp",
    label: "Blåbärstyper",
    description: "Fältskikt som domineras av blåbär och smalbladiga gräs",
  },
  {
    value: "Lingon_grupp",
    label: "Lingon-fattigristyper",
    description:
      "Näringsfattig mark med fältskikt som domineras av lingon, kråkbär, ljung eller andra fattigris",
  },
];

// Define an interface for the environment parameters.
interface EnvParams {
  geography: string;
  forestType: string;
  standAge: string;
  vegetationType: string;
}

export const useEnvParamsStore = defineStore("envParams", {
  state: () => ({
    // These are set by DashboardC.vue’s watcher or via route parameters.
    geography: "",
    forestType: "",
    standAge: "",
    vegetationType: "",
  }),
  actions: {
    // Destructure the parameters and type them.
    setParams({ geography, forestType, standAge, vegetationType }: EnvParams) {
      this.geography = geography || "";
      this.forestType = forestType || "";
      this.standAge = standAge || "";
      this.vegetationType = vegetationType || "";
    },
  },
  getters: {
    geographyLabel: (state) => {
      const option = geographyOptions.find((o) => o.value === state.geography);
      return option ? option.label : state.geography;
    },
    forestTypeLabel: (state) => {
      const option = forestTypeOptions.find(
        (o) => o.value === state.forestType
      );
      return option ? option.label : state.forestType;
    },
    standAgeLabel: (state) => {
      const option = standAgeOptions.find((o) => o.value === state.standAge);
      return option ? option.label : state.standAge;
    },
    vegetationTypeLabel: (state) => {
      const option = vegetationTypeOptions.find(
        (o) => o.value === state.vegetationType
      );
      return option ? option.label : state.vegetationType;
    },
  },
});

// Image mapping for forestType and vegetationType
export const imageMap: Record<string, string> = {
  Barrblandskog: "/images/miljo/barrblandskog.png",
  Blåbär_grupp: "/images/miljo/blabar.png",
  Granskog: "/images/miljo/granskog.png",
  Lövskog: "/images/miljo/lövskog.png",
  Naturbete: "/images/miljo/naturbete.png",
  Tallskog: "/images/miljo/tallskog.png",
  Lingon_grupp: "/images/miljo/lingon.png",
  krakbär: "/images/miljo/krakbar.png",
  Örter_grupp: "/images/miljo/lagort.png",
};

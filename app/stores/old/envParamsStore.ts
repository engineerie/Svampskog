import { defineStore } from "pinia";

const geographyOptions = [
  { value: "Norr", label: "Norra Sverige", description: "Norr om latitud 60°" },
  { value: "Söder", label: "Södra Sverige", description: "Söder om latitud 60°" },
];

const forestTypeOptions = [
  { value: "Granskog", label: "Granskog" },
  { value: "Tallskog", label: "Tallskog" },
  { value: "Barrblandskog", label: "Barrblandskog" },
  { value: "Lövblandskog", label: "Blandskog" },
  { value: "Lövskog", label: "Övrig lövskog" },
  { value: "EkBokskog", label: "Ek och Bokskog" },
  { value: "Naturbete", label: "Trädklädd betesmark" },
];

const standAgeOptions = [
  { value: "1-40", label: "1-40 år" },
  { value: "41-90", label: "41-90 år" },
  { value: "91", label: "91 år och äldre" },
  { value: "allaåldrar", label: "Alla åldrar" },
];

const vegetationTypeOptions = [
  { value: "Örter_grupp", label: "Örttyper" },
  { value: "Blåbär_grupp", label: "Blåbärstyper" },
  { value: "Lingon_grupp", label: "Lingon-fattigristyper" },
];

export const useEnvParamsStore = defineStore("envParams", {
  state: () => ({
    geography: "",
    forestType: "",
    standAge: "",
    vegetationType: "",
  }),
  actions: {
    setParams({
      geography,
      forestType,
      standAge,
      vegetationType,
    }: {
      geography: string;
      forestType: string;
      standAge: string;
      vegetationType: string;
    }) {
      this.geography = geography;
      this.forestType = forestType;
      this.standAge = standAge;
      this.vegetationType = vegetationType;
    },
  },
  getters: {
    geographyLabel: (state) => {
      const option = geographyOptions.find((o) => o.value === state.geography);
      return option ? option.label : state.geography;
    },
    forestTypeLabel: (state) => {
      const option = forestTypeOptions.find((o) => o.value === state.forestType);
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
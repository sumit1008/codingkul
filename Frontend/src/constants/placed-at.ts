export interface CompanyLogo {
  name: string;
  file: string;
}

export const PLACED_AT_COMPANIES: CompanyLogo[] = [
  { name: "Texas Instruments", file: "texas-instruments.webp" },
  { name: "Fastenal",          file: "fastenal.webp"          },
  { name: "Formcept",          file: "formcept.webp"          },
  { name: "Infosys",           file: "infosys.webp"           },
  { name: "TCS",               file: "tcs.webp"               },
  { name: "Amdocs",            file: "amdocs.webp"            },
  { name: "Kratikal",          file: "kratikal.webp"          },
  { name: "Visa",              file: "visa.webp"              },
  { name: "Accenture",         file: "accenture.webp"         },
  { name: "Mphasis",           file: "mphasis.webp"           },
];

// Duplicated once for seamless infinite loop — never modify at runtime
export const MARQUEE_TRACK = [...PLACED_AT_COMPANIES, ...PLACED_AT_COMPANIES];

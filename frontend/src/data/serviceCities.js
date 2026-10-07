/** Canonical service-area cities by county — single source for footer pills, admin tagging, etc. */
export const SERVICE_AREA_BY_COUNTY = [
  {
    name: 'Hillsborough',
    cities: [
      'Lutz',
      'Carrollwood',
      'Tampa',
      'Brandon',
      'Thonotosassa',
      'Riverview',
      'Temple Terrace',
      'Plant City',
      'Sun City Center',
      'Gibsonton',
    ],
  },
  {
    name: 'Pasco',
    cities: [
      "Land O' Lakes",
      'Wesley Chapel',
      'Dade City',
      'New Port Richey',
      'Odessa',
    ],
  },
  {
    name: 'Pinellas',
    cities: [
      'Clearwater',
      'St. Petersburg',
      'Palm Harbor',
      'Oldsmar',
      'Largo',
      'Tarpon Springs',
    ],
  },
]

/** Flat list in county order — footer pills / display */
export const SERVICE_AREA_CITIES = SERVICE_AREA_BY_COUNTY.flatMap((c) => c.cities)

/** Alphabetical — admin dropdowns / tagging */
export const SERVICE_CITIES = [...SERVICE_AREA_CITIES].sort((a, b) =>
  a.localeCompare(b)
)

export const SERVICE_AREA_HEADLINE =
  'Serving Hillsborough, Pasco, and Pinellas counties'

 (function() {
  /**
   * Helper object for working with countries data and extracting information.
   * See countries-data.js for format of the countries data set.
   */
  let countries = {
  /**
   * Store all countries from countries-data.js on `countries.all` for convenience.
   */
  all: window.countriesData,
  
  /**
   * Return an array of all countries, with the Name Object replaced by the
   * appropriate translation, or English if not specified (or unknown).  For
   * example, when language="English", you would process the record for Canada into:
   *
   * {
   *     code: "CA",
   *     continent: "Americas",
   *     areaInKm2: 9984670,
   *     population: 36624199,
   *     capital: "Ottawa",
   *     name: "Canada"
   * }
   *
   * Supported languages include:
   *
   * English, Arabic, Chinese, French, Hindi, Korean, Japanese, Russian
   *
   * Uses `countries.all` as the underlying array of countries to be processed.
   *
   * HINT: make sure you don't overwrite the original name object.
   */
  getByLanguage: function(language)
  {
  let languageList = [];
  let selectLanguage;
  if (language)
  {
  selectLanguage = language;
  }
  else
  {
  selectLanguage = "English";
  }
  for (let i = 0; i < countries.all.length; i++)
  {
  let languageObject = {};
  languageObject.code = countries.all[i].code;
  languageObject.continent = countries.all[i].continent;
  languageObject.areaInKm2 = countries.all[i].areaInKm2;
  languageObject.population = countries.all[i].population;
  languageObject.capital = countries.all[i].capital;
  languageObject.name = countries.all[i].name[selectLanguage];
  languageList.push(languageObject);
  }
  return languageList;
  },
  
  /**
   * Return an array of countries with a population greater than or equal to
   * `minPopulation`, and possibly less than equal to `maxPopulation` (if defined)
   * otherwise allow any number greater than `minPopulation`.
   *
   * Uses getByLanguage('English') to get English names for countries.
   *
   * @param {Number} minPopulation - (Required) minimum population value
   * @param {Number} maxPopulation - (Optional) maximum population value
   */
  getByPopulation: function(minPopulation, maxPopulation)
  {
  var countriesByLanguage = this.getByLanguage("English");
  var CountryList = [];
  for (var country of countriesByLanguage)
  {
  if (maxPopulation)
  {
  if (country.population >= minPopulation && country.population <= maxPopulation)
  {
  CountryList.push(country);
  }
  }
  else
  {
  if (country.population >= minPopulation)
  {
  CountryList.push(country);
  }
  }
  }
  return CountryList;
  },
  
  /**
   * Return an array of countries for the given `continent` with an area
   * greater than or equal to the given `area` in square KM.
   *
   * Uses getByLanguage('English') to get English names for countries.
   *
   * @param {String} continent - (Required) name of the continent (e.g., Europe)
   * @param {Number} minArea - (Required) minimum number of KM2 area
   */
  getByAreaAndContinent: function(continent, minArea)
  {
  var countriesByLanguage = this.getByLanguage("English");
  var tempCountryList = [];
  for (var country of countriesByLanguage)
  {
  if (minArea)
  {
  if (country.areaInKm2 >= minArea && country.continent === continent)
  {
  tempCountryList.push(country);
  }
  }
  else
  {
  if (country.continent === continent)
  {
  tempCountryList.push(country);
  }
  }
  }
  return tempCountryList;
  }
  };
  
  /**
   * Helper functions for building table elements.
   */
  let tableHelper = {
  /**
   * Clears (any) existing rows from the #table-rows table body
   */
  clearTable: function()
  {
  var tBody = document.querySelector('#table-rows');
  while (tBody.firstChild)
  {
  tBody.removeChild(tBody.firstChild);
  }
  },
  
  /**
   * Takes a `country.code` (e.g., "CA" for Canada) and returns an <img>
   * element with its `src` property set the appropriate flag image URL
   * for this code, e.g., src="flags/ca.png" for Canada.
   */
  countryCodeToFlagImg: function(countryCode)
  {
  var c = countryCode.toLowerCase();
  var image = document.createElement('img');
  image.src = 'flags/' + c + '.png';
  image.alt = '';
  return image;
  },
  
  /**
   * Takes a single `country` object and converts it to a <tr> with <td>
   * child elements for every column in the row.  The row should match the
   * expected format of the table (i.e., flag, code, country, continent, etc).
   * Return the new <tr>...</tr> row.
   *
   * Use the DOM methods document.createElement(), element.appendChild(), etc
   * to create your <tr> row.
   */
  countryToRow: function(country)
  {
  let countryObject = {};
  countryObject.flag = tableHelper.countryCodeToFlagImg(country.code);
  countryObject.code = country.code;
  countryObject.name = country.name;
  countryObject.continent = country.continent;
  countryObject.areaInKm2 = country.areaInKm2;
  countryObject.population = country.population;
  countryObject.capital = country.capital;
  
  let tableRow = document.createElement("tr");
  
  for (var country in countryObject)
  {
  let tableElement = document.createElement("td");
  if (country == "flag")
  {
  tableElement.appendChild(countryObject.flag);
  }
  else
  {
  let text = document.createTextNode(countryObject[country]);
  tableElement.appendChild(text);
  }
  tableRow.appendChild(tableElement);
  }
  
  return tableRow;
  },
  
  /**
   * Takes an array of `country` Objects named `countries`, and passes each
   * `country` in the array  to `tableHelper.countryToRow()`.  The resulting
   * rows are then appended to the #table-rows table body element.  Make sure
   * you use `tableHelper.clear()` to remove any existing rows before you do this.
   */
  countriesToTable: function(countries)
  {
  tableHelper.clearTable();
  var tBody = document.querySelector('#table-rows');
  for (var i of countries)
  {
  tBody.appendChild(this.countryToRow(i));
  }
  }
  };
  
  /**
   * Register click handlers for every menu item in the page.  Use the `countries`
   * and `tableHelper` Objects, and their associated methods, to update/populate
   * the #table-rows table body with the appropriate set of countries, based on the
   * menu item clicked.
   *
   * Make sure you also update the #subtitle heading to properly reflect what
   * is in the table after you populate it. For example: "List of Countries
   * and Dependencies - Population between 1 and 2 million" or "List of Countries
   * and Dependencies - All countries in Asia" etc.
   */
  function setupMenuHandlers()
  {
  document.querySelector('#menu_english').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('English'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in English (English)';
  };
  document.querySelector('#menu_arabic').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Arabic'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Arabic (عربى)';
  };
  document.querySelector('#menu_chinese').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Chinese'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Chinese (中文 )';
  };
  document.querySelector('#menu_french').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('French'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in French (Française)';
  };
  document.querySelector('#menu_hindi').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Hindi'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Hindi (हिंदी)';
  };
  document.querySelector('#menu_korean').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Korean'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Korean (한국어)';
  };
  document.querySelector('#menu_japanese').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Japanese'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Japanese (日本語)';
  };
  document.querySelector('#menu_russian').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByLanguage('Russian'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Country/Dep. Name is in Russian (русский)';
  };
  document.querySelector('#menu_population_100_000_000m').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByPopulation(100000000));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Population ( >=1000000000)';
  };
  document.querySelector('#menu_population_1m_2m').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByPopulation(1000000, 2000000));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	Population ( 1~2 Million )';
  };
  document.querySelector('#menu_americas_1mkm').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByAreaAndContinent('Americas', 1000000));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	1 million Km' + '2'.sup() + ' area in America';
  };
  document.querySelector('#menu_asia_all').onclick = function()
  {
  tableHelper.countriesToTable(countries.getByAreaAndContinent('Asia'));
  document.querySelector('#subtitle').innerHTML =
  'List of Countries and Dependencies - 	All size, Asia';
  };
  }
  
  // When the page loads, setup all event handlers by calling setup function.
  window.onload = setupMenuHandlers;
  })();

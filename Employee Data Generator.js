// ========================== variables ====================================================
let maleFirstNames = [
  "Adam",
  "Alexandr",
  "Daniel",
  "David",
  "Dominik",
  "Filip",
  "Jakub",
  "Jan",
  "Jaroslav",
  "Jindřich",
  "Josef",
  "Karel",
  "Lukáš",
  "Martin",
  "Matěj",
  "Michal",
  "Ondřej",
  "Pavel",
  "Petr",
  "Radek",
  "Roman",
  "Stanislav",
  "Tomáš",
  "Václav",
  "Vojtěch",
];

let femaleFirstNames = [
  "Adéla",
  "Alena",
  "Andrea",
  "Anna",
  "Barbora",
  "Blanka",
  "Dana",
  "Diana",
  "Eliška",
  "Eva",
  "Gabriela",
  "Hana",
  "Ivana",
  "Jana",
  "Karolína",
  "Kateřina",
  "Klára",
  "Lenka",
  "Lucie",
  "Marie",
  "Martina",
  "Nikola",
  "Petra",
  "Radka",
  "Tereza",
];

let maleLastNames = [
  "Novák",
  "Svoboda",
  "Novotný",
  "Dvořák",
  "Černý",
  "Procházka",
  "Kučera",
  "Veselý",
  "Horák",
  "Němec",
  "Pokorný",
  "Marek",
  "Pospíšil",
  "Hájek",
  "Jelínek",
  "Král",
  "Růžička",
  "Beneš",
  "Fiala",
  "Sedláček",
  "Doležal",
  "Zeman",
  "Kolář",
  "Šťastný",
  "Navrátil",
];

let femaleLastNames = [
  "Nováková",
  "Svobodová",
  "Novotná",
  "Dvořáková",
  "Černá",
  "Procházková",
  "Kučerová",
  "Veselá",
  "Horáková",
  "Němcová",
  "Pokorná",
  "Marková",
  "Pospíšilová",
  "Hájeková",
  "Jelínková",
  "Králová",
  "Růžičková",
  "Benešová",
  "Fialová",
  "Sedláčková",
  "Doležalová",
  "Zemanová",
  "Kolářová",
  "Šťastná",
  "Navrátilová",
];

let workloads = [10, 20, 30, 40];
//============================================================================================

// ========================== function to choose one random item from array ==================
function randomItem(items) {
  let randomName = items[Math.floor(Math.random() * items.length)];

  return randomName;
}

// generates random gender and based on gender selects male or female first name and last name
function generateGenderAndName() {
  let gender = Math.floor(Math.random() * 2) === 0 ? "male" : "female";

  let name;
  let surname;

  // if gender is male, it will choose from male names and surnames
  if (gender === "male") {
    name = randomItem(maleFirstNames);
    surname = randomItem(maleLastNames);
  } else {
    name = randomItem(femaleFirstNames);
    surname = randomItem(femaleLastNames);
  }

  return { gender, name, surname };
}

// ========================== generates random birthdate withing an age range ================
function getRandomBirthdate(age) {
  const currentDate = new Date();

  const minYear = currentDate.getFullYear() - age.max;
  const maxYear = currentDate.getFullYear() - age.min;

  const minDate = new Date(
    minYear,
    currentDate.getMonth(),
    currentDate.getDate()
  );
  const maxDate = new Date(
    maxYear,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const randomDate = new Date(
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime())
  );

  return randomDate.toISOString();
}

// ========================== function that generates employees data =========================
function generateEmployeeData(dtoIn) {
  const { count, age } = dtoIn;
  const employees = [];

  for (let i = 0; i < count; i++) {
    const { gender, name, surname } = generateGenderAndName();
    const employee = {
      gender,
      birthdate: getRandomBirthdate(age),
      name,
      surname,
      workload: randomItem(workloads),
    };
    employees.push(employee);
  }
  return employees;
}

// function to count number of names (based on preferences)
function countNames(items, filterN) {
  const filteredNames = items.filter(filterN).map((i) => i.name);
  const nameCounts = {};

  filteredNames.forEach((name) => {
    nameCounts[name] = (nameCounts[name] || 0) + 1;
  });

  return nameCounts;
}

// function that counts num of names
function getEmployeeChartContent(dtoIn) {
  const item = generateEmployeeData(dtoIn);

  const allNamesCount = countNames(item, () => true);
  const femaleNameCount = countNames(item, (i) => i.gender === "female");
  const maleNameCount = countNames(item, (i) => i.gender === "male");
  const femalePartTimeCount = countNames(
    item,
    (i) => i.workload != "40" && i.gender === "female"
  );
  const maleFullTimeCount = countNames(
    item,
    (i) => i.workload === "40" && i.gender === "male"
  );

  const convertData = (nameCounts) => {
    return Object.entries(nameCounts).map(([label, value]) => ({
      label,
      value,
    }));
  };

  return {
    names: {
      all: allNamesCount,
      male: maleNameCount,
      female: femaleNameCount,
      femalePartTime: femalePartTimeCount,
      maleFullTime: maleFullTimeCount,
    },
    chartData: {
      all: convertData(allNamesCount),
      male: convertData(maleNameCount),
      female: convertData(femaleNameCount),
      femalePartTime: convertData(femalePartTimeCount),
      maleFullTime: convertData(maleFullTimeCount),
    },
  };
}

// main function
function main(dtoIn) {
  return getEmployeeChartContent(dtoIn);
}

const dtoIn = {
  count: 100,
  age: {
    min: 10,
    max: 60,
  },
};

const dtoOut = main(dtoIn);
console.log(JSON.stringify(dtoOut, null, 2));
